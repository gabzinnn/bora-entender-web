"use client";

import { Botao } from "@/app/components/Botao";
import { Input } from "@/app/components/Input";
import { CreditCard, Lock, User, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Plan } from "./PlanCard";
import { PaymentMethodSelector, type PaymentMethod } from "./PaymentMethodSelector";
import { PixPayment, type PixData } from "./PixPayment";

interface PaymentFormProps {
  plan: Plan | null;
  isLoading: boolean;
  onSubmitCard: (cardData: CardData) => void;
  onGeneratePix: () => void;
  onCheckPixPayment: () => void;
  pixData: PixData | null;
}

export interface CardData {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export function PaymentForm({ 
  plan, 
  isLoading, 
  onSubmitCard,
  onGeneratePix,
  onCheckPixPayment,
  pixData,
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardData, setCardData] = useState<CardData>({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleChange = (field: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    onSubmitCard(cardData);
  };

  // Determina se PIX está disponível para este plano
  const allowPix = plan?.allowPix ?? plan?.periodo === "anual";

  return (
    <div className="space-y-6">
      {/* Seletor de Método de Pagamento */}
      <PaymentMethodSelector
        selected={paymentMethod}
        onSelect={setPaymentMethod}
        allowPix={allowPix}
        disabled={!plan}
      />

      {/* Formulário de Cartão ou PIX */}
      {paymentMethod === "card" ? (
        <div className="bg-white rounded-xl border border-border-light p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-text-primary font-bold text-lg">Dados do Cartão</h3>
            <div className="flex gap-2">
              <div className="h-7 w-10 bg-bg-tertiary rounded flex items-center justify-center border border-border-light">
                <CreditCard className="h-4 w-4 text-text-secondary" />
              </div>
              <div className="h-7 w-10 bg-bg-tertiary rounded flex items-center justify-center border border-border-light">
                <div className="flex -space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome no Cartão"
              placeholder="Como aparece no cartão"
              value={cardData.cardholderName}
              onChange={handleChange("cardholderName")}
              leftIcon={User}
              disabled={!plan}
            />

            <Input
              label="Número do Cartão"
              placeholder="0000 0000 0000 0000"
              value={cardData.cardNumber}
              onChange={handleChange("cardNumber")}
              mask="9999 9999 9999 9999"
              leftIcon={CreditCard}
              rightIcon={Lock}
              disabled={!plan}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Validade"
                placeholder="MM/AA"
                value={cardData.expiry}
                onChange={handleChange("expiry")}
                mask="99/99"
                disabled={!plan}
              />
              <Input
                label="CVC"
                placeholder="123"
                value={cardData.cvc}
                onChange={handleChange("cvc")}
                mask="9999"
                numericOnly
                rightIcon={HelpCircle}
                disabled={!plan}
              />
            </div>

            <Botao
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={ArrowRight}
              isLoading={isLoading}
              disabled={!plan}
              className="mt-6"
            >
              Finalizar Pagamento
            </Botao>

            <div className="flex items-center justify-center gap-2 pt-2">
              <Lock className="h-4 w-4 text-text-secondary" />
              <p className="text-xs text-text-secondary font-medium">
                Pagamento 100% seguro e criptografado
              </p>
            </div>
          </form>
        </div>
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