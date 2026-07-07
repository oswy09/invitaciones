import { useState } from "react";

const FAQS = [
  {
    pregunta: "¿En cuánto tiempo recibo el link de mi invitación?",
    respuesta:
      "Una vez que confirmes el pago, recibes el link listo en menos de 24 horas. En la mayoría de los casos lo entregamos el mismo día.",
  },
  {
    pregunta: "¿Puedo ver cómo queda antes de pagar?",
    respuesta:
      "Sí. Después de llenar el formulario con tus datos, puedes ver una preview completa de tu invitación antes de confirmar el pago.",
  },
  {
    pregunta: "¿Funciona en iPhone y Android?",
    respuesta:
      "Sí, el link funciona en cualquier dispositivo con navegador: iPhone, Android, computador o tablet. No requiere instalar ninguna app.",
  },
  {
    pregunta: "¿Puedo cambiar los datos después de recibirlo?",
    respuesta:
      "Incluimos hasta 2 cambios de datos (nombre, fecha, lugar) sin costo adicional dentro de los primeros 3 días. Cambios posteriores tienen un costo adicional.",
  },
  {
    pregunta: "¿Cuánto tiempo está activo el link?",
    respuesta:
      "El link permanece activo durante 30 días después de la fecha del evento.",
  },
  {
    pregunta: "¿Cómo pago?",
    respuesta:
      "Aceptamos pagos por Nequi, Daviplata y transferencia bancaria. Te enviamos los datos de pago por WhatsApp después de que veas tu preview.",
  },
];

export default function FAQSection() {
  const [abierto, setAbierto] = useState<number | null>(null);

  return (
    <section
      aria-label="Preguntas frecuentes"
      style={{ backgroundColor: "#F8F5F0", padding: "5rem 1.5rem" }}
    >
      <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
        <p
          className="text-sm font-semibold tracking-widest uppercase mb-3 text-center"
          style={{ color: "#7A5C10" }}
        >
          FAQ
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold mb-12 text-center"
          style={{ fontFamily: "'Playfair Display', serif", color: "#5A1B5E" }}
        >
          Preguntas frecuentes
        </h2>

        <div className="flex flex-col">
          {FAQS.map((faq, i) => {
            const isOpen = abierto === i;
            return (
              <div key={i} style={{ borderTop: "1px solid #E8B4BC" }}>
                <button
                  onClick={() => setAbierto(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#3A1140" }}
                  >
                    {faq.pregunta}
                  </span>
                  <span
                    className="text-xl font-light flex-shrink-0 transition-transform duration-200"
                    style={{
                      color: "#5A1B5E",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    +
                  </span>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? "200px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.25s ease",
                  }}
                >
                  <p
                    className="text-sm leading-relaxed pb-4"
                    style={{ color: "#4A4A4A" }}
                  >
                    {faq.respuesta}
                  </p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: "1px solid #E8B4BC" }} />
        </div>
      </div>
    </section>
  );
}
