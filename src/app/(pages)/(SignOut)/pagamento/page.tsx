"use client";

import { Modal, useModal } from "@/app/components/Modals/Modal";
import { OrderSummary } from "@/app/components/Pagamento/OrderSummary";
import { PaymentForm } from "@/app/components/Pagamento/PaymentForm";
import { Plan } from "@/app/components/Pagamento/PlanCard";
import { PlanSelector } from "@/app/components/Pagamento/PlanSelector";
import { PixData } from "@/app/components/Pagamento/PixPayment";
import api from "@/services/axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Logo from "@/app/components/Logo";

function PagamentoContent() {
  const params = useSearchParams();
  const userId = params.get("userId");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const router = useRouter();
  const modal = useModal();

  // Buscar planos do backend
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await api.get("/plano");
        setPlans(response.data);
        const popularPlan = response.data.find((p: Plan) => p.popular);
        if (popularPlan) {
          setSelectedPlan(popularPlan);
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    }

    fetchPlans();
  }, []);

  // Limpar PIX ao trocar de plano
  useEffect(() => {
    setPixData(null);
  }, [selectedPlan?.id]);

  useEffect(() => {
    async function createPaymentIntent() {
      if (!selectedPlan || !userId) {
        setSetupIntentClientSecret(null);
        setSubscriptionId(null);
        return;
      }

      try {
        const response = await api.post("/pagamento/criar-intent", {
          planoId: selectedPlan.id,
          priceId: selectedPlan.stripePriceId,
          userId: Number(userId),
        });
        
        setSetupIntentClientSecret(response.data.setupIntentClientSecret);
        setSubscriptionId(response.data.subscriptionId);
      } catch (error) {
        console.error("Erro ao criar payment intent:", error);
      }
    }

    createPaymentIntent();
  }, [selectedPlan?.id, userId]);

  const handleCardConfirm = useCallback(async (paymentMethodId: string) => {
    if (!subscriptionId) return;
    setIsLoading(true);
    try {
      await api.post("/pagamento/confirmar-assinatura", {
        subscriptionId,
        paymentMethodId,
      });

      modal.success(
        "Pagamento confirmado!",
        "Sua assinatura foi ativada com sucesso!",
        () => router.push("/login")
      );
    } catch (error: any) {
      modal.error("Erro", error?.response?.data?.message || "Erro ao confirmar pagamento");
    } finally {
      setIsLoading(false);
    }
  }, [subscriptionId, modal, router]);

  async function handleGeneratePix() {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      const response = await api.post("/pagamento/criar-pix", {
        planoId: selectedPlan.id,
        valor: selectedPlan.preco,
        userId: Number(userId),
      });

      setPixData({
        qrCode: response.data.qrCode,
        qrCodeText: response.data.qrCodeText,
        expiresAt: new Date(response.data.expiresAt),
        paymentIntentId: response.data.paymentIntentId,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Ocorreu um erro ao gerar o PIX.";
      modal.error("Erro ao gerar PIX", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCheckPixPayment() {
    if (!pixData?.paymentIntentId) return;

    setIsLoading(true);
    try {
      const response = await api.get(`/pagamento/verificar-pix/${pixData.paymentIntentId}`);

      if (response.data.status === "succeeded") {
        modal.success(
          "Pagamento confirmado!",
          "Sua assinatura foi ativada com sucesso. Aproveite todos os benefícios do seu plano!",
          () => router.push("/dashboard")
        );
      } else if (response.data.status === "pending") {
        modal.warning(
          "Pagamento pendente",
          "Ainda não identificamos seu pagamento. Aguarde alguns instantes e tente novamente."
        );
      } else {
        modal.error(
          "Pagamento não encontrado",
          "Não conseguimos confirmar seu pagamento. Verifique se o PIX foi realizado corretamente."
        );
      }
    } catch (error: any) {
      modal.error("Erro", "Erro ao verificar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentError = useCallback((message: string) => {
    modal.error("Erro no pagamento", message);
  }, [modal]);

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <nav className="w-full flex justify-center py-6 sm:py-8 bg-white border-b border-border-lighter">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="xl" variant="completo" />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Plan Selection */}
          <div className="space-y-6">
            <PlanSelector
              plans={plans}
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
            />
          </div>

          {/* Right Column - Order Summary & Payment */}
          <div className="space-y-6">
            <OrderSummary plan={selectedPlan} />

            <PaymentForm
              plan={selectedPlan}
              setupIntentClientSecret={setupIntentClientSecret}
              subscriptionId={subscriptionId}
              isLoading={isLoading}
              onCardConfirm={handleCardConfirm}
              onError={handlePaymentError}
              onGeneratePix={handleGeneratePix}
              onCheckPixPayment={handleCheckPixPayment}
              pixData={pixData}
            />

            <div className="text-center">
              <Link
                href="/planos"
                className="text-sm text-text-secondary hover:text-primary transition-colors font-medium"
              >
                ← Voltar para planos
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        type={modal.options.type}
        title={modal.options.title}
        message={modal.options.message}
        primaryButton={modal.options.primaryButton}
        secondaryButton={modal.options.secondaryButton}
      />
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <PagamentoContent />
    </Suspense>
  );
}