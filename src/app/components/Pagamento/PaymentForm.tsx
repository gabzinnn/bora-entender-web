"use client";

import { useState } from "react";
import type { Plan } from "./PlanCard";
import { PaymentMethodSelector, type PaymentMethod } from "./PaymentMethodSelector";
import { PixPayment, type PixData } from "./PixPayment";
import { CardForm } from "./CardForm";
import { StripeProvider } from "./StripeProvider";

interface PaymentFormProps {
  plan: Plan | null;
  isLoading: boolean;
  setupIntentClientSecret: string | null; // 👈 Mudou o nome
  subscriptionId: string | null; // 👈 Novo
  onCardConfirm: (paymentMethodId: string) => void; // 👈 Novo
  onError: (message: string) => void;
  onGeneratePix: () => void;
  onCheckPixPayment: () => void;
  pixData: PixData | null;
}

export function PaymentForm({ 
  plan, 
  isLoading, 
  setupIntentClientSecret,
  subscriptionId,
  onCardConfirm,
  onError,
  onGeneratePix,
  onCheckPixPayment,
  pixData,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const allowPix = plan?.allowPix ?? plan?.periodo === "anual";

  return (
    <div className="space-y-6">
      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={setPaymentMethod}
        allowPix={allowPix}
        disabled={!plan}
      />

      {paymentMethod === "card" ? (
        setupIntentClientSecret && subscriptionId ? (
          <StripeProvider clientSecret={setupIntentClientSecret}>
            <CardForm 
              subscriptionId={subscriptionId}
              onSuccess={onCardConfirm} 
              onError={onError} 
            />
          </StripeProvider>
        ) : (
          <div className="bg-white rounded-xl border border-border-light p-6">
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              {plan ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-text-secondary">Preparando checkout seguro...</p>
                </>
              ) : (
                <p className="text-sm text-text-secondary">Selecione um plano para continuar</p>
              )}
            </div>
          </div>
        )
      ) : (
        <PixPayment
          plan={plan}
          isLoading={isLoading}
          pixData={pixData}
          onGeneratePix={onGeneratePix}
          onCheckPayment={onCheckPixPayment}
        />
      )}
    </div>
  );
}