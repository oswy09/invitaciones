import { useEffect, useState } from "react";

export interface PreviewMessage<TInvitationData> {
  type: "invitation:update";
  data: TInvitationData;
  pagado: boolean;
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
      const msg = event.data as PreviewMessage<TInvitationData>;
      if (!msg || msg.type !== "invitation:update") return;
      onUpdate(msg.data, msg.pagado);
    }

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: "invitation:ready" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, [isPreview, onUpdate]);

  return isPreview;
}
