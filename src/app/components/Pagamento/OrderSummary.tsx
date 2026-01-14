"use client";

import { CheckCircle, Tag } from "lucide-react";
import type { Plan } from "./PlanCard";

interface OrderSummaryProps {
  plan: Plan | null;
  discount?: {
    code: string;
    percentOff: number;
  };
}

function formatPrice(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function OrderSummary({ plan, discount }: OrderSummaryProps) {
  if (!plan) {
    return (
      <div className="p-6 bg-bg-tertiary rounded-xl border border-border-light">
        <p className="text-text-secondary text-center">Selecione um plano para continuar</p>
      </div>
    );
  }

  const subtotal = plan.preco;
  const discountAmount = discount ? Math.round(subtotal * (discount.percentOff / 100)) : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="bg-white rounded-xl border border-border-light overflow-hidden">
      {/* Plan Header */}
      <div className="p-6 border-b border-border-lighter">
        <div className="flex justify-between items-start mb-4">
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

        {/* Benefits Preview */}
        <div className="space-y-2">
          {plan.beneficios.slice(0, 3).map((beneficio, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary-alt shrink-0" />
              <span className="text-text-primary text-sm">{beneficio}</span>
            </div>
          ))}
          {plan.beneficios.length > 3 && (
            <p className="text-text-secondary text-sm pl-8">
              +{plan.beneficios.length - 3} benefícios
            </p>
          )}
        </div>
      </div>

      {/* Price Summary */}
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
        </div>

        {discount && (
          <div className="flex justify-between text-sm">
            <span className="text-primary-alt flex items-center gap-1">
              <Tag className="h-4 w-4" />
              Cupom {discount.code}
            </span>
            <span className="text-primary-alt font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-border-lighter flex justify-between">
          <span className="text-text-primary font-bold">Total</span>
          <span className="text-text-primary text-xl font-bold">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}