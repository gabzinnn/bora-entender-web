import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Check } from 'lucide-react';
import api from '@/services/axios';
import { Modal } from './Modal';
import { Input } from '../Input';
import { Botao } from '../Botao';
import { useAlunosAdmin } from '@/hooks/useAlunosAdmin';
import { TurmaAdmin, useAlunosDaTurma } from '@/hooks/useTurmasAdmin';

interface CriarEditarTurmaModalProps {
    isOpen: boolean;
    onClose: () => void;
    turmaParaEditar?: TurmaAdmin | null;
}

export function CriarEditarTurmaModal({ isOpen, onClose, turmaParaEditar }: CriarEditarTurmaModalProps) {
    const queryClient = useQueryClient();
    const { data: alunosResponse } = useAlunosAdmin({ page: 1, perPage: 500 });
    const { data: membrosAtuais } = useAlunosDaTurma(turmaParaEditar?.id ?? null);
    const alunos = alunosResponse?.data ?? [];

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [alunoIds, setAlunoIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (turmaParaEditar) {
                setNome(turmaParaEditar.nome);
                setDescricao(turmaParaEditar.descricao ?? '');
            } else {
                setNome('');
                setDescricao('');
                setAlunoIds([]);
            }
        }
    }, [isOpen, turmaParaEditar]);

    useEffect(() => {
        if (turmaParaEditar && membrosAtuais) {
            setAlunoIds(membrosAtuais.map((a) => a.id));
        }
    }, [turmaParaEditar, membrosAtuais]);

    const mutation = useMutation({
        mutationFn: async (data: { nome: string; descricao?: string; alunoIds: number[] }) => {
            if (turmaParaEditar) {
                return api.patch(`/turma/${turmaParaEditar.id}`, data);
            }
            return api.post('/turma', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['turmasAdmin'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ nome, descricao: descricao || undefined, alunoIds });
    };

    const toggleAluno = (id: number) => {
        setAlunoIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={turmaParaEditar ? 'Editar Turma' : 'Nova Turma'} size="xl">
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    label="Nome da Turma"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Ex: Turma A"
                />
                <Input
                    label="Descrição (opcional)"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex: Turma da tarde"
                />

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-text-primary flex items-center justify-between">
                        Alunos da Turma
                        <span className="text-xs font-normal text-text-tertiary">{alunoIds.length} selecionados</span>
                    </label>
                    <div className="bg-bg-secondary/30 rounded-xl border border-border-light p-3 min-h-[150px] max-h-[300px] overflow-y-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {alunos.map((aluno) => (
                                <div
                                    key={aluno.id}
                                    onClick={() => toggleAluno(aluno.id)}
                                    className={`cursor-pointer px-3 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 group ${alunoIds.includes(aluno.id)
                                        ? 'border-primary bg-primary/10 text-primary font-bold'
                                        : 'border-border-light bg-white text-text-secondary hover:border-primary/30 hover:shadow-sm'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${alunoIds.includes(aluno.id) ? 'bg-primary border-primary' : 'border-border-light group-hover:border-primary/50'
                                        }`}>
                                        {alunoIds.includes(aluno.id) && <Check size={10} className="text-white" />}
                                    </div>
                                    <span className="truncate">{aluno.nome}</span>
                                </div>
                            ))}
                            {alunos.length === 0 && (
                                <span className="text-xs italic text-text-tertiary col-span-2">Nenhum aluno cadastrado</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border-light gap-3">
                    <Botao variant="outline" onClick={onClose} type="button">
                        Cancelar
                    </Botao>
                    <Botao type="submit" isLoading={mutation.isPending} leftIcon={Save}>
                        {turmaParaEditar ? 'Salvar Turma' : 'Criar Turma'}
                    </Botao>
                </div>
            </form>
        </Modal>
    );
}
