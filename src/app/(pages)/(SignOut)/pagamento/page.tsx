"use client";

import { Modal, useModal } from "@/app/components/Modals/Modal";
import { OrderSummary } from "@/app/components/Pagamento/OrderSummary";
import { CardData, PaymentForm } from "@/app/components/Pagamento/PaymentForm";
import { Plan } from "@/app/components/Pagamento/PlanCard";
import { PlanSelector } from "@/app/components/Pagamento/PlanSelector";
import { PixData } from "@/app/components/Pagamento/PixPayment";
import api from "@/services/axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// ==========================================
// PLACEHOLDER DATA - Substituir pela API depois
// ==========================================
const PLACEHOLDER_PLANS: Plan[] = [
  {
    id: 1,
    nome: "Plano Mensal",
    preco: 2990, // R$ 29,90
    stripePriceId: "price_monthly_placeholder",
    periodo: "mensal",
    allowPix: false, // ❌ PIX não disponível para mensal
    beneficios: [
      "Acesso ilimitado a todos os cursos",
      "Certificado de conclusão digital",
      "Suporte prioritário na comunidade",
      "Download de materiais em PDF",
    ],
  },
  {
    id: 2,
    nome: "Plano Anual",
    preco: 24990, // R$ 249,90
    stripePriceId: "price_annual_placeholder",
    periodo: "anual",
    popular: true,
    allowPix: true, // ✅ PIX disponível para anual
    beneficios: [
      "Todos os benefícios do mensal",
      "Economia de 30% (equivale a R$ 20,83/mês)",
      "Acesso antecipado a novos cursos",
      "Mentoria mensal em grupo",
      "Desconto em eventos exclusivos",
    ],
  },
];

export default function PagamentoPage() {
  const [plans, setPlans] = useState<Plan[]>(PLACEHOLDER_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const router = useRouter();
  const modal = useModal();

  // Buscar planos do backend
  useEffect(() => {
    async function fetchPlans() {
      try {
        // const response = await api.get("/planos");
        // setPlans(response.data);
        
        setPlans(PLACEHOLDER_PLANS);
        
        const popularPlan = PLACEHOLDER_PLANS.find((p) => p.popular);
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

  // ==========================================
  // PAGAMENTO COM CARTÃO
  // ==========================================
  async function handleCardPayment(cardData: CardData) {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      const response = await api.post("/pagamento/criar-checkout", {
        planoId: selectedPlan.id,
        stripePriceId: selectedPlan.stripePriceId,
      });

      // Redirecionar para Stripe Checkout
      window.location.href = response.data.url;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Ocorreu um erro ao processar o pagamento.";
      modal.error("Erro no pagamento", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // PAGAMENTO COM PIX
  // ==========================================
  async function handleGeneratePix() {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      const response = await api.post("/pagamento/criar-pix", {
        planoId: selectedPlan.id,
        valor: selectedPlan.preco,
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
  }

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <nav className="w-full flex justify-center py-6 sm:py-8 bg-white border-b border-border-lighter">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/images/logoCompleto.png"
            alt="Bora Entender Logo"
            width={140}
            height={60}
          />
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
              isLoading={isLoading}
              onSubmitCard={handleCardPayment}
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