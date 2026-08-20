'use client';

import { useState } from 'react';
import AdminSidebar from "@/app/components/AdminSidebar";
import { AdminHeader } from "@/app/components/AdminHeader";
import { CriarEditarTurmaModal } from '@/app/components/Modals/CriarEditarTurmaModal';
import { useTurmasAdmin, TurmaAdmin } from '@/hooks/useTurmasAdmin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/axios';
import { Users, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

export default function TurmasAdmin() {
    const { data: turmas = [], isLoading } = useTurmasAdmin();
    const [modalAberto, setModalAberto] = useState(false);
    const [turmaParaEditar, setTurmaParaEditar] = useState<TurmaAdmin | null>(null);
    const [turmaParaExcluir, setTurmaParaExcluir] = useState<TurmaAdmin | null>(null);

    const queryClient = useQueryClient();
    const excluirMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/turma/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['turmasAdmin'] });
            setTurmaParaExcluir(null);
        },
    });

    const abrirCriar = () => { setTurmaParaEditar(null); setModalAberto(true); };
    const abrirEditar = (turma: TurmaAdmin) => { setTurmaParaEditar(turma); setModalAberto(true); };

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-bg-secondary">
                    <AdminHeader
                        title="Turmas"
                        subtitle="Gerencie as turmas e seus alunos matriculados"
                        showSearch={false}
                        showUserProfile={true}
                        actionLabel="Nova Turma"
                        actionIcon={Plus}
                        onActionClick={abrirCriar}
                    />

                    <div className="p-4 md:p-6 lg:p-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : turmas.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                                <Users size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Nenhuma turma cadastrada</h3>
                                <p className="text-sm text-gray-400 max-w-sm mb-4">Crie uma turma para começar a registrar presença nas aulas.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {turmas.map((turma) => (
                                    <div key={turma.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{turma.nome}</h3>
                                                {turma.descricao && <p className="text-sm text-gray-400">{turma.descricao}</p>}
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button onClick={() => abrirEditar(turma)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all cursor-pointer" title="Editar turma">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => setTurmaParaExcluir(turma)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer" title="Excluir turma">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Users size={14} />
                                            {turma._count.alunos} aluno{turma._count.alunos !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <CriarEditarTurmaModal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                turmaParaEditar={turmaParaEditar}
            />

            {turmaParaExcluir && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => !excluirMutation.isPending && setTurmaParaExcluir(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Excluir Turma</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Tem certeza que deseja excluir a turma <strong>{turmaParaExcluir.nome}</strong>?
                            </p>
                            <p className="text-xs text-gray-400 mb-6">
                                Esta ação é irreversível. Todas as aulas e presenças registradas nessa turma serão removidas.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setTurmaParaExcluir(null)}
                                    disabled={excluirMutation.isPending}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => excluirMutation.mutate(turmaParaExcluir.id)}
                                    disabled={excluirMutation.isPending}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    {excluirMutation.isPending ? (
                                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
