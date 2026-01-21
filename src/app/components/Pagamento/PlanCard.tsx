"use client";

import { CheckCircle, CreditCard, QrCode } from "lucide-react";
import { FaPix } from "react-icons/fa6";

export interface Plan {
  id: number;
  nome: string;
  preco: number;
  stripePriceId: string;
  beneficios: string[];
  periodo?: "mensal" | "anual";
  popular?: boolean;
  allowPix?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: (plan: Plan) => void;
}

function formatPrice(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className={`
        relative w-full p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200
        ${selected 
          ? "border-primary-alt bg-primary-alt/5 shadow-md" 
          : "border-border-light bg-white hover:border-primary-alt/50"
        }
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-4 bg-primary-alt text-white text-xs font-bold px-3 py-1 rounded-full">
          Mais popular
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 mt-4">
        <div>
          <h3 className="text-text-primary text-lg font-bold">{plan.nome}</h3>
          <p className="text-text-secondary text-sm">
            Cobrança {plan.periodo === "anual" ? "anual" : "mensal"}
          </p>
        </div>
        <div className="text-right">
          <div className="text-text-primary text-2xl font-bold">
            {formatPrice(plan.preco)}
          </div>
          <span className="text-xs text-text-secondary">
            / {plan.periodo === "anual" ? "ano" : "mês"}
          </span>
        </div>
      </div>

      {/* Payment Methods Badges */}
      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-1 text-xs text-text-secondary bg-bg-tertiary px-2 py-1 rounded-full">
          <CreditCard className="h-3 w-3" />
          <span>Cartão</span>
        </div>
        {plan.allowPix && (
          <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <FaPix className="h-3 w-3" />
            <span>PIX</span>
          </div>
        )}
      </div>

      {/* Benefits */}
      <div className="space-y-2">
        {plan.beneficios.map((beneficio, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-primary-alt shrink-0" />
            <span className="text-text-primary text-sm">{beneficio}</span>
          </div>
        ))}
      </div>

      {/* Selection Indicator */}
      <div
        className={`
          absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all
          ${selected 
            ? "border-primary-alt bg-primary-alt" 
            : "border-border-light bg-white"
          }
        `}
      >
        {selected && (
          <CheckCircle className="h-full w-full text-white" />
        )}
      </div>
    </button>
  );
}