-- Políticas RLS para admin autenticado (Supabase Auth)
-- Un usuario autenticado (admin logueado) puede leer y modificar todo.

-- eventos
CREATE POLICY "admin_all_eventos" ON eventos
  FOR ALL USING (auth.role() = 'authenticated');

-- muro_deseos
CREATE POLICY "admin_all_muro_deseos" ON muro_deseos
  FOR ALL USING (auth.role() = 'authenticated');

-- confirmaciones_rsvp
CREATE POLICY "admin_all_rsvp" ON confirmaciones_rsvp
  FOR ALL USING (auth.role() = 'authenticated');
