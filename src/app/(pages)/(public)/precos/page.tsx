"use client";

import { useEffect, useMemo, useState } from "react";
import { PublicContainer } from "@/app/components/public/PublicSiteLayout";
import { PlanCard } from "@/app/components/public/PlanCard";
import { SkeletonPlanCard } from "@/app/components/public/Skeletons";

type Plano = {
    id: number;
    nome: string;
    preco: number;
    stripePriceId: string;
    beneficios: string[];
    periodo?: "mensal" | "anual";
    popular?: boolean;
};

export default function PrecosPage() {
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlanos() {
            try {
                const { default: api } = await import("@/services/axios");
                const response = await api.get("/plano");
                setPlanos(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar planos", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPlanos();
    }, []);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <SkeletonPlanCard key={i} />
                    ))}
                </div>
            );
        }

        if (!planos.length) {
            return (
                <div className="bg-bg-secondary rounded-xl p-6 border border-border-light">
                    <p className="text-text-secondary">Nenhum plano disponível no momento.</p>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {planos.map((plano) => (
                    <PlanCard key={plano.id} {...plano} />
                ))}
            </div>
        );
    }, [loading, planos]);

    return (
        <PublicContainer>
            <div className="max-w-3xl mb-12">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary mb-5">Nossos planos</h1>
                <p className="text-lg text-black leading-relaxed">
                    Planos pensados para diferentes perfis de alunos e famílias. Escolha a opção ideal para aprender com
                    consistência e sem complicações.
                </p>
            </div>

            {content}
        </PublicContainer>
    );
}
