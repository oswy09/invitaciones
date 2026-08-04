import { useEffect, useState } from "react";

export interface PreviewMessage<TInvitationData> {
  type: "invitation:update";
  data: TInvitationData;
  pagado: boolean;
}

interface PreviewNavigateMessage {
  type: "preview:navigate";
  topRatio?: number;
  openIfNeeded?: boolean;
}

/**
 * Activa el modo preview cuando la URL tiene ?preview=1 (usado por client-form
 * para mostrar cambios del formulario en tiempo real dentro de un iframe).
 */
export function usePreviewBridge<TInvitationData>(
  onUpdate: (data: TInvitationData, pagado: boolean) => void
): boolean {
  const [isPreview] = useState(() => new URLSearchParams(window.location.search).get("preview") === "1");

  useEffect(() => {
    if (!isPreview) return;

    function handleMessage(event: MessageEvent) {
      const msg = event.data as PreviewMessage<TInvitationData> | PreviewNavigateMessage;
      if (!msg) return;

      if (msg.type === "preview:navigate") {
        if (msg.openIfNeeded) {
          const candidates = Array.from(document.querySelectorAll("button, [role='button'], a")) as HTMLElement[];
          const opener = candidates.find((el) => {
            const text = (el.textContent ?? "").toLowerCase();
            const aria = (el.getAttribute("aria-label") ?? "").toLowerCase();
            return aria.includes("abrir invitacion") || text.includes("abrir invitacion") || text.includes("toca para abrir") || text.includes("clic al sobre");
          });
          opener?.click();
        }

        const ratio = typeof msg.topRatio === "number" ? Math.max(0, Math.min(1, msg.topRatio)) : 0;
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: maxScroll * ratio, behavior: "smooth" });
        return;
      }

      if (msg.type !== "invitation:update") return;
      onUpdate(msg.data, msg.pagado);
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "invitation:ready" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview, onUpdate]);

  return isPreview;
}
