-- ============================================================
-- Migración 004: permite que el formulario de cliente (client-form)
-- cree eventos directamente con la clave anónima, sin backend propio.
-- Solo permite crear pedidos PENDIENTES (sin pagar ni aprobar) — nunca
-- se puede insertar un evento ya pagado/aprobado desde el cliente.
-- ============================================================

CREATE POLICY "public_insert_eventos_pendientes" ON eventos
  FOR INSERT
  WITH CHECK (pagado = false AND aprobado = false);
