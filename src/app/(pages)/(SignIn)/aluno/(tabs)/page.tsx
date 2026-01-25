'use client';
import CardMateria from "@/app/components/CardMateria";
import LoadingScreen from "@/app/components/LoadingScreen";
import Logo from "@/app/components/Logo";
import { useAuth } from "@/app/context/authContext";
import { useHomeAluno } from "@/hooks/useHomeAluno";
import { CircleCheckBig, Clock, Flame, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useAuth();

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    if (error) {
        return (
            <main className="w-full min-h-screen h-full flex justify-center items-center">
                <p>Erro ao carregar os dados: {error.message}</p>
            </main>
        )
    }

    const handleViewProfile = () => {
        router.push('/aluno/perfil');
        setMenuOpen(false);
    };

    return (
        <main className="w-full min-h-screen h-full flex flex-col p-8">
            {/* Header com saudação e informações do aluno */}
            <div className="w-full flex flex-row mb-8 items-center">
                <Logo size="lg" variant="icone"  />
                <div className="flex flex-col ml-6">
                    <h1 className="text-4xl font-black mb-2 text-text-primary">Olá, {data?.aluno.nome.split(' ')[0] || 'Aluno'}!</h1>
                    <h3 className="text-xl text-text-tertiary">Pronto para dominar os estudos hoje?</h3>
                </div>
                <div className="relative ml-auto">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex flex-row items-center justify-between border-border-light border rounded-full px-6 py-2 shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="flex flex-col">
                            <span className="text-md font-semibold text-text-primary">{data?.aluno.nome}</span>
                            <span className="text-sm font-medium text-text-tertiary ml-auto">{data?.aluno.anoEscolar}º ano</span>
                        </div>
                        <Image
                            src={"https://lh3.googleusercontent.com/aida-public/AB6AXuBcy7aghZwyfwjdAAHbk4-swTAFXCjlNHzD4_xCwQsxNeDmEz70cZQ4d3Elbi2RTMlqPi7NSiDnzqQAsi20Y7_luaZhFXoOMKzEd5XJh_kNWP1cHPko5WUe5buokaaEkXVMG_XCYV6kreky8HcrRnFIdMOWRyutMnEMXIfrD6k-2_rXPraOSp9-IExAsS_qQoKVZbcqoNsmctVcrj_12LJ3w3HCaG8mkVj1ENz4qH1OHtfcv9lKKPgpov5jWOg6LAobfQIua5PGyusU"}
                            alt="Avatar do Aluno"
                            width={40}
                            height={40}
                            className="ml-4 rounded-full"
                        />
                    </button>

                    {/* Menu Dropdown */}
                    {menuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                            <button
                                onClick={handleViewProfile}
                                className="w-full flex items-center gap-3 px-4 py-3 text-text-main hover:bg-gray-50 transition-colors rounded-t-xl font-medium text-sm cursor-pointer"
                            >
                                <User size={18} />
                                Ver Perfil
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                                onClick={signOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-b-xl font-medium text-sm cursor-pointer"
                            >
                                <LogOut size={18} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-6">
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