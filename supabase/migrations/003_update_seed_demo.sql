-- ============================================================
-- Migración 003: actualiza el evento de prueba 'baby-shower-demo'
-- a datos genéricos (nombre, dirección, fecha a ~20 días desde hoy).
-- SOLO proyecto de DESARROLLO "Invitaciones full".
-- ============================================================

UPDATE eventos
SET
  fecha_evento = '2026-07-12',
  datos = '{
    "eventoId": "baby-shower-demo",
    "templateId": "01-dino",
    "pagado": true,
    "tituloEvento": "Baby Shower",
    "nombresPrincipales": ["Bebé"],
    "anfitriones": "La Familia",
    "fecha": "2026-07-12",
    "hora": "10:30",
    "fechaTexto": "Domingo, 12 de Julio de 2026",
    "lugar": {
      "nombre": "Centro Comercial Santafé",
      "direccion": "Autopista Norte con Calle 185 (Calle 185 # 45 - 03), Bogotá",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Santafe+Calle+185+%2345-03+Bogota"
    },
    "whatsappNumero": "573000000000",
    "features": {
      "muroDeseos": true,
      "rsvp": true,
      "countdown": true,
      "mapa": true,
      "musica": false
    }
  }'::jsonb
WHERE id = 'baby-shower-demo';
