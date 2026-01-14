"use client";

import { Botao } from "@/app/components/Botao";
import { Copy, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import type { Plan } from "./PlanCard";

interface PixPaymentProps {
  plan: Plan | null;
  isLoading: boolean;
  pixData: PixData | null;
  onGeneratePix: () => void;
  onCheckPayment: () => void;
}

export interface PixData {
  qrCode: string; // Base64 da imagem do QR Code
  qrCodeText: string; // Código Copia e Cola
  expiresAt: Date;
  paymentIntentId: string;
}

export function PixPayment({ 
  plan, 
  isLoading, 
  pixData, 
  onGeneratePix,
  onCheckPayment 
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  // Timer para expiração
  useEffect(() => {
    if (!pixData?.expiresAt) return;

    const updateTimer = () => {
      const now = new Date();
      const expires = new Date(pixData.expiresAt);
      const diff = expires.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("Expirado");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [pixData?.expiresAt]);

  // Copiar código PIX
  const handleCopy = async () => {
    if (!pixData?.qrCodeText) return;
    
    try {
      await navigator.clipboard.writeText(pixData.qrCodeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  // Se não tem PIX gerado, mostrar botão para gerar
  if (!pixData) {
    return (
      <div className="bg-white rounded-xl border border-border-light p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.7 2.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4l4 4a1 1 0 0 0 1.4-1.4L10.4 8H16a1 1 0 0 0 0-2h-5.6l2.3-2.3a1 1 0 0 0 0-1.4zM8 15a1 1 0 0 0-1 1v.6l-2.3-2.3a1 1 0 1 0-1.4 1.4l4 4a1 1 0 0 0 1.4 0l4-4a1 1 0 0 0-1.4-1.4L10 16.6V16a1 1 0 0 0-1-1h-.1z"/>
            </svg>
          </div>
          
          <div>
            <h3 className="text-text-primary font-bold text-lg">Pagar com PIX</h3>
            <p className="text-text-secondary text-sm mt-1">
              Gere um QR Code para pagar instantaneamente
            </p>
          </div>

          <Botao
            variant="primary"
            size="lg"
            fullWidth
            onClick={onGeneratePix}
            isLoading={isLoading}
            disabled={!plan}
          >
            Gerar QR Code PIX
          </Botao>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border-light p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-text-primary font-bold text-lg">Pague com PIX</h3>
        <div className={`flex items-center gap-1 text-sm ${isExpired ? "text-brand-red" : "text-text-secondary"}`}>
          <Clock className="h-4 w-4" />
          <span>{timeLeft}</span>
        </div>
      </div>

      {isExpired ? (
        // QR Code expirado
        <div className="text-center space-y-4">
          <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
            <div className="text-center">
              <Clock className="h-12 w-12 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary text-sm">QR Code expirado</p>
            </div>
          </div>
          
          <Botao
            variant="secondary"
            size="md"
            onClick={onGeneratePix}
            isLoading={isLoading}
            leftIcon={RefreshCw}
          >
            Gerar Novo QR Code
          </Botao>
        </div>
      ) : (
        // QR Code válido
        <div className="space-y-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-xl border border-border-light shadow-sm">
              <img
                src={`data:image/png;base64,${pixData.qrCode}`}
                alt="QR Code PIX"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Copia e Cola */}
          <div className="space-y-2">
            <p className="text-sm text-text-secondary text-center">
              Ou copie o código abaixo:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixData.qrCodeText}
                readOnly
                className="flex-1 px-3 py-2 text-sm bg-bg-tertiary border border-border-light rounded-lg truncate"
              />
              <Botao
                variant={copied ? "primary" : "secondary"}
                size="md"
                onClick={handleCopy}
                leftIcon={copied ? CheckCircle : Copy}
              >
                {copied ? "Copiado!" : "Copiar"}
              </Botao>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-bg-tertiary p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium text-text-primary">Como pagar:</p>
            <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
              <li>Abra o app do seu banco</li>
              <li>Escolha pagar com PIX</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento</li>
            </ol>
          </div>

          {/* Verificar Pagamento */}
          <Botao
            variant="primary"
            size="lg"
            fullWidth
            onClick={onCheckPayment}
            isLoading={isLoading}
            leftIcon={CheckCircle}
          >
            Já Paguei - Verificar Pagamento
          </Botao>
        </div>
      )}
    </div>
  );
}