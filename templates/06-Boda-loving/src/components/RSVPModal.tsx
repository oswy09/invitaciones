import React, { useState } from 'react';
import { X, Send, Heart, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappPhone: string;
  maxSeats: number;
  brideName: string;
  groomName: string;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({
  isOpen,
  onClose,
  whatsappPhone,
  maxSeats,
  brideName,
  groomName,
}) => {
  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [seatsCount, setSeatsCount] = useState(maxSeats || 1);
  const [dietary, setDietary] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    if (attending === 'yes') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8A9D85', '#DCE5DA', '#2D382B', '#E8C46A'],
      });
    }

    const message = attending === 'yes'
      ? `¡Hola ${brideName} y ${groomName}! 👋✨\n\nConfirmo con mucha alegría mi asistencia a su boda 💍\n👤 Nombre: *${guestName}*\n👥 Cupos que utilizaremos: *${seatsCount}*\n${
          dietary ? `🥗 Restricciones alimentarias: ${dietary}\n` : ''
        }\n¡Nos vemos pronto para celebrar juntos! ❤️`
      : `¡Hola ${brideName} y ${groomName}! 👋\n\nLamentablemente no podré acompañarlos a su boda por motivos de fuerza mayor.\n👤 Nombre: *${guestName}*\n\n¡Les deseo todo lo mejor en esta nueva etapa y que Dios bendiga su matrimonio! 🤍`;

    const cleanPhone = whatsappPhone.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#FBF8F2] rounded-2xl shadow-2xl overflow-hidden border border-[#DCE5DA] text-[#2D382B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECE5] bg-[#F4F1EA]">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-[#3D4E3A] fill-[#3D4E3A]" />
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-[#2D382B]">
              Confirmación de Asistencia (RSVP)
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/15 text-[#3D4E3A] transition"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-montserrat text-xs">
          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-[#4E5C4B] uppercase mb-1.5">
              Tu Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Familia Rodríguez Pérez"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DDD2] bg-white text-sm text-[#2D382B] focus:outline-none focus:ring-2 focus:ring-[#1E2B1C]/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold tracking-wider text-[#4E5C4B] uppercase mb-2">
              ¿Nos acompañarás? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition font-medium ${
                  attending === 'yes'
                    ? 'bg-[#2D382B] text-white border-[#2D382B] shadow-sm'
                    : 'bg-white text-[#586854] border-[#D4DDD2] hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 size={16} /> ¡Sí, asistiré!
              </button>
              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition font-medium ${
                  attending === 'no'
                    ? 'bg-stone-700 text-white border-stone-700 shadow-sm'
                    : 'bg-white text-stone-500 border-[#D4DDD2] hover:bg-stone-50'
                }`}
              >
                <XCircle size={16} /> No podré asistir
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <>
              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-[#4E5C4B] uppercase mb-1.5">
                  Cupos a Confirmar
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={seatsCount}
                    onChange={(e) => setSeatsCount(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D4DDD2] bg-white text-sm text-[#2D382B] focus:outline-none focus:ring-2 focus:ring-[#1E2B1C]/50"
                  >
                    {Array.from({ length: Math.max(maxSeats || 2, 4) }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Invitado / Cupo' : 'Invitados / Cupos'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold tracking-wider text-[#4E5C4B] uppercase mb-1.5">
                  Restricciones o requerimientos especiales (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Vegetariano, alergia a mariscos, etc."
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D4DDD2] bg-white text-xs text-[#2D382B] focus:outline-none focus:ring-2 focus:ring-[#1E2B1C]/50"
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-full bg-[#2D382B] text-white font-montserrat uppercase tracking-wider font-semibold text-xs hover:bg-[#3D4C3B] transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={15} /> Enviar Confirmación por WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RSVPModal;
