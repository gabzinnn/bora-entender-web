"use client";

import { CreditCard, QrCode } from "lucide-react";
import { FaPix } from "react-icons/fa6";

export type PaymentMethod = "card" | "pix";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  allowPix: boolean;
  disabled?: boolean;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  allowPix,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-text-primary font-bold text-base">Forma de Pagamento</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Cartão de Crédito */}
        <button
          type="button"
          onClick={() => onSelect("card")}
          disabled={disabled}
          className={`
            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
            ${selected === "card"
              ? "border-primary bg-primary/5"
              : "border-border-light bg-white hover:border-primary/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <CreditCard className={`h-6 w-6 ${selected === "card" ? "text-primary" : "text-text-secondary"}`} />
          <span className={`text-sm font-medium ${selected === "card" ? "text-primary" : "text-text-primary"}`}>
            Cartão de Crédito
          </span>
          <span className="text-xs text-text-secondary">Cobrança automática</span>
        </button>

        {/* PIX */}
        <button
          type="button"
          onClick={() => allowPix && onSelect("pix")}
          disabled={disabled || !allowPix}
          className={`
            relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
            ${!allowPix 
              ? "opacity-40 cursor-not-allowed border-border-light bg-gray-50" 
              : selected === "pix"
                ? "border-primary bg-primary/5"
                : "border-border-light bg-white hover:border-primary/50 cursor-pointer"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <FaPix className={`h-6 w-6 ${selected === "pix" && allowPix ? "text-primary" : "text-text-secondary"}`} />
          <span className={`text-sm font-medium ${selected === "pix" && allowPix ? "text-primary" : "text-text-primary"}`}>
            PIX
          </span>
          <span className="text-xs text-text-secondary">
            {allowPix ? "Pagamento único" : "Apenas planos anuais"}
          </span>
          
          {!allowPix && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
              <span className="text-xs text-text-secondary bg-white px-2 py-1 rounded shadow-sm">
                Indisponível
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Info text */}
      {selected === "pix" && allowPix && (
        <p className="text-xs text-text-secondary bg-primary/5 p-3 rounded-lg">
          💡 O PIX não permite cobrança automática. Você receberá um lembrete quando sua assinatura estiver próxima do vencimento.
        </p>
      )}
    </div>
  );
}