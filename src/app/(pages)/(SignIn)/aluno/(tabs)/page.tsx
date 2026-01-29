'use client';
import AvatarAluno from "@/app/components/AvatarAluno";
import CardMateria from "@/app/components/CardMateria";
import Logo from "@/app/components/Logo";
import HomeAlunoSkeleton from "@/app/components/Skeleton/HomeAlunoSkeleton";
import { useHomeAluno } from "@/hooks/useHomeAluno";
import { CircleCheckBig, Clock, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CardStatProps {
    cor: string;
    icone: React.ReactNode;
    titulo: string;
    valor: string;
}

function CardStat({ cor, icone, titulo, valor }: CardStatProps) {
    return (
        <div 
            className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow"
        >
            <div 
                className="size-12 rounded-2xl flex items-center justify-center text-3xl"
                style={{ 
                    backgroundColor: `${cor}10`,
                    color: cor 
                }}
            >
                {icone}
            </div>
            <div>
                <p className="text-text-secondary text-sm font-semibold">{titulo}</p>
                <p className="text-2xl font-bold text-text-main">{valor}</p>
            </div>
        </div>
    );
}

export default function HomeAluno() {
    const { data, error, isLoading } = useHomeAluno();
    const router = useRouter();

    if (isLoading) {
        return (
            <HomeAlunoSkeleton />
        )
    }

    if (error) {
        return (
            <main className="w-full min-h-screen h-full flex justify-center items-center">
                <p>Erro ao carregar os dados: {error.message}</p>
            </main>
        )
    }

    return (
        <main className="w-full min-h-screen h-full flex flex-col p-8">
            {/* Header com saudação e informações do aluno */}
            <div className="w-full flex flex-col md:flex-row mb-8 items-center">
                <Logo size="lg" variant="icone"  />
                <div className="flex flex-col ml-6">
                    <h1 className="text-4xl font-black mb-2 text-text-primary">Olá, {data?.aluno.nome.split(' ')[0] || 'Aluno'}!</h1>
                    <h3 className="text-xl text-text-tertiary">Pronto para dominar os estudos hoje?</h3>
                </div>
                <div className="relative ml-auto md:w-auto w-full">
                    <AvatarAluno variant="expanded" />
                </div>
            </div>
            <div className="flex flex-row gap-6 bg-bg-secondary">
                <CardStat
                    cor="#00ccf0"
                    icone={<CircleCheckBig />}
                    titulo="Tarefas feitas"
                    valor={`${data?.estatisticas.tarefasFeitas || 0}/${data?.estatisticas.tarefasTotal || 0}`}
                />
                <CardStat
                    cor="#ffd500"
                    icone={<Flame />}
                    titulo="Ofensiva"
                    valor={`${data?.estatisticas.ofensiva || 0}`}
                />
                <CardStat
                    cor="#ff4d2e"
                    icone={<Clock />}
                    titulo="Média Geral"
                    valor={`${data?.estatisticas.mediaGeral || 0}`}
                />
            </div>
            <p className="text-lg font-bold mt-[6vh]">Minhas Matérias</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
                {data?.materias.map((materia) => (
                    <CardMateria
                        key={materia.id}
                        titulo={materia.nome}
                        descricao={materia.descricao}
                        cor={materia.cor}
                        icone={materia.icone}
                        progresso={materia.percentualConcluido}
                        labelStatus={materia.status}
                        botaoText="Ver Conteúdos"
                        status={materia.status.toLowerCase() as "em-dia" | "atrasado" | "novo"}
                        onClick={() => router.push(`/aluno/materia/${materia.id}`)}
                    />
                ))}
            </div>
        </main>
    )
}