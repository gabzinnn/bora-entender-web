import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Botao } from "@/app/components/Botao";
import { PublicContainer } from "@/app/components/public/PublicSiteLayout";

const timeline = [
    {
        year: "2025",
        title: "Início do projeto",
        description: "A ideia começou com a missão de reduzir a distância entre conteúdo escolar e entendimento real.",
    },
    {
        year: "2025",
        title: "Primeiras trilhas de estudo",
        description: "Estruturamos conteúdos por níveis e matérias para facilitar a organização do aluno.",
    },
    {
        year: "2026",
        title: "Evolução da plataforma",
        description: "Adicionamos novos recursos de acompanhamento para alunos e responsáveis.",
    },
];

export default function NossaHistoriaPage() {
    return (
        <PublicContainer>
            <div className="max-w-3xl mb-12">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary mb-5">Nossa história</h1>
                <p className="text-lg text-black leading-relaxed">
                    Construímos o Bora Entender para que estudar não seja um processo cansativo e confuso. Evoluímos com
                    feedback real de alunos e famílias para criar uma experiência cada vez mais objetiva.
                </p>
            </div>

            <div className="space-y-6">
                {timeline.map((item) => (
                    <article key={item.title} className="border border-border-light rounded-xl p-6 bg-white">
                        <p className="text-sm font-semibold text-primary mb-1">{item.year}</p>
                        <h2 className="font-bold text-xl mb-2">{item.title}</h2>
                        <p className="text-text-secondary">{item.description}</p>
                    </article>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link href="/quem-somos">
                    <Botao variant="secondary" rightIcon={ArrowRight}>
                        Conhecer quem somos
                    </Botao>
                </Link>
            </div>
        </PublicContainer>
    );
}
