import Link from "next/link";
import { ArrowRight, Target, Users, Lightbulb } from "lucide-react";
import { Botao } from "@/app/components/Botao";
import { PublicContainer } from "@/app/components/public/PublicSiteLayout";
import { ValueCard } from "@/app/components/public/ValueCard";

const values = [
    {
        title: "Clareza no ensino",
        description: "Transformamos conteúdos difíceis em explicações simples e aplicáveis.",
        icon: Lightbulb,
    },
    {
        title: "Foco no aluno",
        description: "Cada recurso é pensado para respeitar ritmo, contexto e objetivos de quem aprende.",
        icon: Target,
    },
    {
        title: "Parceria com as famílias",
        description: "Oferecemos visibilidade para pais e responsáveis acompanharem a evolução de perto.",
        icon: Users,
    },
];

export default function QuemSomosPage() {
    return (
        <PublicContainer>
            <div className="max-w-3xl mb-12">
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-primary mb-5">Quem somos</h1>
                <p className="text-lg text-black leading-relaxed">
                    O Bora Entender nasceu para tornar o aprendizado escolar mais simples e acessível. Nosso propósito é
                    ajudar alunos a entenderem de verdade cada matéria, com uma metodologia leve, prática e direta.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
                {values.map((value) => (
                    <ValueCard key={value.title} {...value} />
                ))}
            </div>

            <div className="mt-12 bg-brand-yellow/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h3 className="font-heading text-2xl font-bold mb-2">Conheça nossa história completa</h3>
                    <p className="text-text-secondary">Veja como a ideia começou e como estamos evoluindo com nossos alunos.</p>
                </div>
                <Link href="/nossa-historia" className="shrink-0">
                    <Botao variant="secondary" rightIcon={ArrowRight}>
                        Nossa história
                    </Botao>
                </Link>
            </div>
        </PublicContainer>
    );
}
