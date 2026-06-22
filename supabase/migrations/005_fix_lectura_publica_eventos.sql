-- ============================================================
-- Migración 005: corrige la lectura pública de `eventos`.
--
-- La policy original (001) solo permitía leer eventos con aprobado=true,
-- pero el flujo real del negocio es que el cliente debe ver su preview
-- CON marca de agua inmediatamente después de enviar el formulario,
-- antes de que el operador apruebe nada (ver docs/PLAN..., sección 1,
-- pasos 3-5). `pagado` ya controla la marca de agua a nivel de cada
-- plantilla; `aprobado` no debe ocultar la fila completa.
-- ============================================================

DROP POLICY IF EXISTS "public_read_eventos_aprobados" ON eventos;

CREATE POLICY "public_read_eventos" ON eventos
  FOR SELECT USING (true);

-- Nota: no existe (ni debe existir) una policy pública de UPDATE/DELETE
-- sobre eventos — aprobar/marcar pagado solo se hace desde el dashboard
-- de admin (Fase 6), con sus propias credenciales.
