"use client";

import { Botao } from "@/app/components/Botao";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Lock, ArrowRight, CreditCard } from "lucide-react";
import { useState, type FormEvent } from "react";

interface CardFormProps {
  subscriptionId: string;
  onSuccess: (paymentMethodId: string) => void;
  onError: (message: string) => void;
}

export function CardForm({ subscriptionId, onSuccess, onError }: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Confirma o SetupIntent (salva o cartão)
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Erro ao processar pagamento");
      } else if (setupIntent?.payment_method) {
        // Sucesso! O cartão foi salvo, passa o ID para o backend
        onSuccess(setupIntent.payment_method as string);
      }
    } catch (err: any) {
      onError(err.message || "Erro inesperado");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border-light p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-text-primary font-bold text-lg">Dados do Cartão</h3>
        <div className="flex gap-2">
          <div className="h-7 w-10 bg-bg-tertiary rounded flex items-center justify-center border border-border-light">
            <CreditCard className="h-4 w-4 text-text-secondary" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stripe Payment Element */}
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />

        {/* Submit Button */}
        <Botao
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={ArrowRight}
          isLoading={isProcessing}
          disabled={!stripe || !elements || isProcessing}
          className="mt-6"
        >
          {isProcessing ? "Processando..." : "Finalizar Pagamento"}
        </Botao>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Lock className="h-4 w-4 text-text-secondary" />
          <p className="text-xs text-text-secondary font-medium">
            Pagamento 100% seguro e criptografado
          </p>
        </div>
      </form>
    </div>
  );
}