'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminSidebar from "@/app/components/AdminSidebar";
import { AdminHeader } from "@/app/components/AdminHeader";
import { Botao } from '@/app/components/Botao';
import api from '@/services/axios';
import { ArrowLeft, Save, Users, Check } from 'lucide-react';

interface AlunoPresenca {
    alunoId: number;
    nome: string;
    email: string;
    presente: boolean;
}

interface PresencasResponse {
    aula: { id: number; data: string; titulo: string | null; turma: { nome: string } };
    alunos: AlunoPresenca[];
}

async function fetchPresencas(aulaId: string): Promise<PresencasResponse> {
    const res = await api.get<PresencasResponse>(`/aula/${aulaId}/presencas`);
    return res.data;
}

export default function RegistrarPresenca() {
    const { aulaId } = useParams<{ aulaId: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['aulaPresencas', aulaId],
        queryFn: () => fetchPresencas(aulaId),
    });

    const [presencas, setPresencas] = useState<Record<number, boolean>>({});
    const [salvo, setSalvo] = useState(false);

    useEffect(() => {
        if (data) {
            setPresencas(Object.fromEntries(data.alunos.map((a) => [a.alunoId, a.presente])));
        }
    }, [data]);

    const salvarMutation = useMutation({
        mutationFn: () => api.put(`/aula/${aulaId}/presencas`, {
            presencas: Object.entries(presencas).map(([alunoId, presente]) => ({ alunoId: Number(alunoId), presente })),
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aulasAdmin'] });
            setSalvo(true);
            setTimeout(() => setSalvo(false), 2500);
        },
    });

    const toggle = (alunoId: number) => {
        setPresencas((prev) => ({ ...prev, [alunoId]: !prev[alunoId] }));
    };

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-bg-secondary">
                    <AdminHeader
                        title={data?.aula.titulo || 'Registrar Presença'}
                        subtitle={data ? `${data.aula.turma.nome} · ${new Date(data.aula.data).toLocaleDateString('pt-BR')}` : undefined}
                        showSearch={false}
                        showUserProfile={true}
                    />

                    <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
                        <button
                            onClick={() => router.push('/admin/presenca')}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-4 cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Voltar
                        </button>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : !data || data.alunos.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                                <Users size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Nenhum aluno nessa turma</h3>
                                <p className="text-sm text-gray-400 max-w-sm">Adicione alunos à turma em &quot;Turmas&quot; para registrar presença.</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                                    {data.alunos.map((aluno) => {
                                        const presente = presencas[aluno.alunoId] ?? false;
                                        return (
                                            <label key={aluno.alunoId} className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-linear-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                        {aluno.nome.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-800">{aluno.nome}</p>
                                                        <p className="text-xs text-gray-400">{aluno.email}</p>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <input type="checkbox" className="hidden" checked={presente} onChange={() => toggle(aluno.alunoId)} />
                                                    <div className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${presente ? 'bg-primary' : 'bg-gray-300'}`}>
                                                        <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform flex items-center justify-center ${presente ? 'translate-x-5' : 'translate-x-0'}`}>
                                                            {presente && <Check size={12} className="text-primary" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-end gap-3 mt-6">
                                    {salvo && <span className="text-sm font-semibold text-primary">Presença salva!</span>}
                                    <Botao leftIcon={Save} isLoading={salvarMutation.isPending} onClick={() => salvarMutation.mutate()}>
                                        Salvar
                                    </Botao>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
