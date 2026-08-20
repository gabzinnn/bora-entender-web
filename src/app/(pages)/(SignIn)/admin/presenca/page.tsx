'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from "@/app/components/AdminSidebar";
import { AdminHeader } from "@/app/components/AdminHeader";
import { Modal } from '@/app/components/Modals/Modal';
import { Input } from '@/app/components/Input';
import { Botao } from '@/app/components/Botao';
import { useTurmasAdmin } from '@/hooks/useTurmasAdmin';
import { useAulasAdmin } from '@/hooks/useAulasAdmin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/axios';
import { CalendarClock, Plus, ClipboardCheck, Trash2 } from 'lucide-react';

export default function PresencaAdmin() {
    const router = useRouter();
    const { data: turmas = [] } = useTurmasAdmin();
    const [turmaId, setTurmaId] = useState<number | null>(null);
    const { data: aulas = [], isLoading } = useAulasAdmin(turmaId);

    const [modalAberto, setModalAberto] = useState(false);
    const [dataAula, setDataAula] = useState('');
    const [tituloAula, setTituloAula] = useState('');

    const queryClient = useQueryClient();

    const criarAulaMutation = useMutation({
        mutationFn: () => api.post('/aula', { turmaId, data: new Date(dataAula).toISOString(), titulo: tituloAula || undefined }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['aulasAdmin', turmaId] });
            setModalAberto(false);
            setDataAula('');
            setTituloAula('');
        },
    });

    const excluirAulaMutation = useMutation({
        mutationFn: (aulaId: number) => api.delete(`/aula/${aulaId}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['aulasAdmin', turmaId] }),
    });

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-bg-secondary">
                    <AdminHeader
                        title="Presença"
                        subtitle="Registre a presença dos alunos nas aulas de cada turma"
                        showSearch={false}
                        showUserProfile={true}
                        actionLabel={turmaId ? 'Nova Aula' : undefined}
                        actionIcon={Plus}
                        onActionClick={() => setModalAberto(true)}
                    />

                    <div className="p-4 md:p-6 lg:p-8">
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1 block">
                                Turma
                            </label>
                            <select
                                value={turmaId ?? ''}
                                onChange={(e) => setTurmaId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full max-w-sm py-3 px-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none cursor-pointer"
                            >
                                <option value="">Selecione uma turma</option>
                                {turmas.map((t) => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                        </div>

                        {!turmaId ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                                <CalendarClock size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Selecione uma turma</h3>
                                <p className="text-sm text-gray-400 max-w-sm">Escolha uma turma acima para ver e registrar as aulas.</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : aulas.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-16 text-center">
                                <CalendarClock size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Nenhuma aula cadastrada</h3>
                                <p className="text-sm text-gray-400 max-w-sm">Clique em &quot;Nova Aula&quot; para criar a primeira aula dessa turma.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                                {aulas.map((aula) => (
                                    <div key={aula.id} className="flex items-center justify-between px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-800">{aula.titulo || 'Aula sem título'}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(aula.data).toLocaleDateString('pt-BR')} · {aula.totalPresentes} presente{aula.totalPresentes !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Botao size="sm" leftIcon={ClipboardCheck} onClick={() => router.push(`/admin/presenca/${aula.id}`)}>
                                                Registrar presença
                                            </Botao>
                                            <button
                                                onClick={() => excluirAulaMutation.mutate(aula.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                                                title="Excluir aula"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Modal isOpen={modalAberto} onClose={() => setModalAberto(false)} type="custom" title="Nova Aula" size="sm">
                <form
                    className="space-y-4"
                    onSubmit={(e) => { e.preventDefault(); criarAulaMutation.mutate(); }}
                >
                    <Input
                        label="Data da Aula"
                        type="date"
                        value={dataAula}
                        onChange={(e) => setDataAula(e.target.value)}
                        required
                    />
                    <Input
                        label="Título (opcional)"
                        value={tituloAula}
                        onChange={(e) => setTituloAula(e.target.value)}
                        placeholder="Ex: Aula 1 - Introdução"
                    />
                    <div className="flex justify-end gap-3 pt-2">
                        <Botao variant="outline" type="button" onClick={() => setModalAberto(false)}>Cancelar</Botao>
                        <Botao type="submit" isLoading={criarAulaMutation.isPending}>Criar Aula</Botao>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
