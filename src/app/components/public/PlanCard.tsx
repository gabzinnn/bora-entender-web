import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Botao } from "../Botao";

type PlanCardProps = {
    id: number;
    nome: string;
    preco: number;
    precoOriginal?: number | null;
    stripePriceId: string;
    beneficios: string[];
    periodo?: "mensal" | "anual";
    popular?: boolean;
};

function formatPrice(centavos: number) {
    return (centavos / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function PlanCard({ id, nome, preco, precoOriginal, beneficios, periodo, popular }: PlanCardProps) {
    const hasDiscount = precoOriginal && precoOriginal > preco;
    const discountPercent = hasDiscount
        ? Math.round(((precoOriginal - preco) / precoOriginal) * 100)
        : null;

    return (
        <article
            className={`flex flex-col rounded-2xl border-2 p-6 bg-white h-full ${popular ? "border-primary shadow-lg" : "border-border-light"
                }`}
        >
            {/* Badge — reserva espaço mesmo quando ausente para manter alinhamento */}
            <div className="mb-3 min-h-[28px]">
                {popular && (
                    <span className="inline-flex px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
                        Mais popular
                    </span>
                )}
            </div>

            <h2 className="font-bold text-2xl mb-1">{nome}</h2>
            <p className="text-text-secondary mb-4">Cobrança {periodo === "anual" ? "anual" : "mensal"}</p>

            {/* Preço com desconto */}
            <div className="mb-6">
                {hasDiscount && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-base text-text-secondary line-through">
                            {formatPrice(precoOriginal)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                            -{discountPercent}%
                        </span>
                    </div>
                )}
                <p className="font-heading text-4xl text-primary font-bold">
                    {formatPrice(preco)}
                    <span className="text-base text-text-secondary font-normal">/{periodo === "anual" ? "ano" : "mês"}</span>
                </p>
            </div>

            {/* Lista cresce e empurra o botão para a base */}
            <ul className="space-y-3 mb-8 flex-1">
                {beneficios.map((beneficio, index) => (
                    <li key={`${id}-${index}`} className="flex items-start gap-2 text-text-primary">
                        <CheckCircle className="w-5 h-5 text-primary-alt mt-0.5 shrink-0" />
                        <span>{beneficio}</span>
                    </li>
                ))}
            </ul>

            {/* Botão sempre na base */}
            <Link href="/cadastroAluno" className="block mt-auto">
                <Botao variant={popular ? "secondary" : "primary"} fullWidth rightIcon={ArrowRight}>
                    Quero este plano
                </Botao>
            </Link>
        </article>
    );
}
