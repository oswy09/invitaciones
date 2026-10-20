import React, { useState } from 'react';
import { BankAccountInfo } from '../types';
import { Mail, Copy, Check, X, Gift } from 'lucide-react';

interface GiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  bankAccounts: BankAccountInfo[];
}

export const GiftModal: React.FC<GiftModalProps> = ({ isOpen, onClose, bankAccounts }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-[#FBF8F2] rounded-2xl shadow-2xl overflow-hidden border border-[#DCE5DA] text-[#2D382B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8ECE5] bg-[#F4F1EA]">
          <div className="flex items-center gap-2.5">
            <Mail size={18} className="text-[#5B6B58]" />
            <h4 className="font-cinzel text-sm font-semibold tracking-wider text-[#2D382B]">
              Lluvia de Sobres / Mesa de Regalos
            </h4>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#5B6B58] transition"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="font-garamond text-base text-[#4E5C4B] leading-relaxed text-center italic">
            "Su presencia es nuestro mejor regalo. Si desean hacernos un presente en efectivo,
            hemos dispuesto la tradicional lluvia de sobres o transferencias electrónicas."
          </p>

          <div className="space-y-3">
            {bankAccounts.map((acc, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-white border border-[#E2EAE0] shadow-sm space-y-2 text-xs font-montserrat"
              >
                <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                  <span className="font-bold text-[#2D382B] text-sm">{acc.bank}</span>
                  <span className="text-[#768673] uppercase tracking-wider">{acc.accountType}</span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div>
                    <span className="text-[#768673] text-[10px] block uppercase">Número de cuenta</span>
                    <span className="font-mono text-sm font-semibold text-[#2D382B]">
                      {acc.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(acc.accountNumber, `acc-${index}`)}
                    className="p-2 rounded-lg bg-[#F4F7F2] text-[#42523F] hover:bg-[#E4ECE1] transition flex items-center gap-1.5 text-[11px]"
                  >
                    {copiedKey === `acc-${index}` ? (
                      <>
                        <Check size={14} className="text-emerald-600" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-[#5B6B58] pt-1">
                  Titular: <strong className="text-[#2D382B]">{acc.accountHolder}</strong>
                </div>

                {(acc.nequi || acc.daviplata) && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    {acc.nequi && (
                      <div className="flex justify-between items-center p-2 rounded-lg bg-[#FAF5FA] border border-[#F0E5EF]">
                        <div>
                          <span className="text-[9px] font-bold text-[#7A1E73] block uppercase">Nequi</span>
                          <span className="font-mono text-[11px] font-semibold">{acc.nequi}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(acc.nequi!, `nequi-${index}`)}
                          className="text-[#7A1E73] p-1"
                        >
                          {copiedKey === `nequi-${index}` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                    {acc.daviplata && (
                      <div className="flex justify-between items-center p-2 rounded-lg bg-[#FFF7F5] border border-[#FFE7E0]">
                        <div>
                          <span className="text-[9px] font-bold text-[#C8381A] block uppercase">Daviplata</span>
                          <span className="font-mono text-[11px] font-semibold">{acc.daviplata}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(acc.daviplata!, `davi-${index}`)}
                          className="text-[#C8381A] p-1"
                        >
                          {copiedKey === `davi-${index}` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] text-[#7A8A76] font-montserrat uppercase tracking-wider block">
              ✉️ También habrá cofre de sobres el día del evento
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftModal;
