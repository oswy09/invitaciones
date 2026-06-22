import { useEffect, useState } from "react";

export interface PreviewMessage<TInvitationData> {
  type: "invitation:update";
  data: TInvitationData;
  pagado: boolean;
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
      const msg = event.data as PreviewMessage<TInvitationData>;
      if (!msg || msg.type !== "invitation:update") return;
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
