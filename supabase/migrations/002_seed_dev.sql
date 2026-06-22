-- ============================================================
-- Migración 002: datos de prueba (SOLO proyecto de DESARROLLO "Invitaciones full")
-- NO ejecutar contra el proyecto de producción.
-- ============================================================

INSERT INTO eventos (id, template_id, nombre_evento, fecha_evento, datos, pagado, aprobado)
VALUES (
  'baby-shower-demo',
  '01-dino',
  'Baby Shower Demo',
  '2026-08-15',
  '{
    "eventoId": "baby-shower-demo",
    "templateId": "01-dino",
    "pagado": true,
    "tituloEvento": "Baby Shower Demo",
    "nombresPrincipales": ["Demo"],
    "anfitriones": "Familia Demo",
    "fecha": "2026-08-15",
    "hora": "10:30",
    "fechaTexto": "Sábado, 15 de Agosto de 2026",
    "lugar": {
      "nombre": "Salón de Pruebas",
      "direccion": "Calle Falsa 123",
      "mapUrl": "https://maps.google.com"
    },
    "features": {
      "muroDeseos": true,
      "rsvp": true,
      "countdown": true,
      "mapa": true,
      "musica": false
    }
  }'::jsonb,
  true,
  true
)
ON CONFLICT (id) DO NOTHING;
