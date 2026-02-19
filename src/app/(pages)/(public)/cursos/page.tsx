"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { PublicContainer } from "@/app/components/public/PublicSiteLayout";
import { CourseCard } from "@/app/components/public/CourseCard";
import { SkeletonCard } from "@/app/components/public/Skeletons";
import { Botao } from "@/app/components/Botao";

type MateriaPublica = {
    id: number;
    nome: string;
    descricao: string | null;
    cor: string | null;
    topicos: number;
};

export default function CursosPage() {
    const [materias, setMaterias] = useState<MateriaPublica[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMaterias() {
            try {
                const { default: api } = await import("@/services/axios");
                const response = await api.get("/materia/lista-publica");
                setMaterias(response.data || []);
            } catch (error) {
                console.error("Erro ao carregar matérias", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMaterias();
    }, []);

    const content = useMemo(() => {
        if (loading) {
            return (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonCard key={i} className="h-full" />
                    ))}
                </div>
            );
        }

        if (!materias.length) {
            return (
                <div className="bg-bg-secondary rounded-xl p-6 border border-border-light">
                    <p className="text-text-secondary">Estamos preparando novos cursos. Em breve teremos novidades por aqui.</p>
                </div>
            );
        }

        return (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {materias.map((materia) => (
                    <CourseCard key={materia.id} {...materia} />
                ))}
            </div>
        );
    }, [loading, materias]);

    return (
        <PublicContainer>
            <div className="max-w-3xl mb-12">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary mb-5">Cursos</h1>
                <p className="text-lg text-black leading-relaxed">
                    Conheça as matérias disponíveis na plataforma e veja como organizamos os conteúdos para facilitar seu
                    aprendizado.
                </p>
            </div>

            {content}

            <div className="mt-12 text-center">
                <Link href="/precos">
                    <Botao variant="secondary" rightIcon={ArrowRight}>
                        Ver planos
                    </Botao>
                </Link>
            </div>
        </PublicContainer>
    );
}
