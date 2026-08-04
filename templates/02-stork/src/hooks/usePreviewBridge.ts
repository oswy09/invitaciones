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
 * En ese modo, la plantilla NO debe leer de Supabase — espera mensajes
 * postMessage del formulario padre con el InvitationData en borrador.
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
    // Avisa al padre que ya está listo para recibir datos (evita perder el
    // primer mensaje si el iframe carga después de que el form ya cambió algo).
    window.parent.postMessage({ type: "invitation:ready" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview, onUpdate]);

  return isPreview;
}
