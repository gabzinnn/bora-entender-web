import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Plus, Trash2, Save, Check } from 'lucide-react';
import api from '@/services/axios';
import { Modal } from './Modal';
import { Input } from '../Input';
import { Botao } from '../Botao';
import useMateriaAdmin from '@/hooks/useMateriaAdmin';
import { PlanoAdmin } from '@/hooks/usePlanoAdmin';

interface CriarEditarPlanoModalProps {
    isOpen: boolean;
    onClose: () => void;
    planoParaEditar?: PlanoAdmin | null;
}

export function CriarEditarPlanoModal({ isOpen, onClose, planoParaEditar }: CriarEditarPlanoModalProps) {
    const queryClient = useQueryClient();
    const { data: materias = [] } = useMateriaAdmin(); // Busca todas as matérias para seleção

    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState(0); // em centavos
    const [precoOriginal, setPrecoOriginal] = useState<number | null>(null);
    const [stripePriceId, setStripePriceId] = useState('');
    const [periodo, setPeriodo] = useState<'MENSAL' | 'ANUAL'>('MENSAL');
    const [popular, setPopular] = useState(false);
    const [allowPix, setAllowPix] = useState(false);
    const [ativo, setAtivo] = useState(true);

    // Benefícios
    const [beneficios, setBeneficios] = useState<string[]>([]);
    const [novoBeneficio, setNovoBeneficio] = useState('');

    // Matérias selecionadas
    const [materiasIds, setMateriasIds] = useState<number[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (planoParaEditar) {
                setNome(planoParaEditar.nome);
                setPreco(planoParaEditar.preco);
                setPrecoOriginal(planoParaEditar.precoOriginal ?? null);
                setStripePriceId(planoParaEditar.stripePriceId);
                setPeriodo(planoParaEditar.periodo);
                setPopular(planoParaEditar.popular);
                setAllowPix(planoParaEditar.allowPix);
                setAtivo(planoParaEditar.ativo);
                setBeneficios(planoParaEditar.beneficios || []);
                setMateriasIds(planoParaEditar.materiasIds || []);
            } else {
                limparFormulario();
            }
        }
    }, [isOpen, planoParaEditar]);

    const limparFormulario = () => {
        setNome('');
        setPreco(0);
        setPrecoOriginal(null);
        setStripePriceId('');
        setPeriodo('MENSAL');
        setPopular(false);
        setAllowPix(false);
        setAtivo(true);
        setBeneficios([]);
        setMateriasIds([]);
        setNovoBeneficio('');
    };

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (planoParaEditar) {
                return api.patch(`/plano/${planoParaEditar.id}`, data);
            } else {
                return api.post('/plano', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planosAdmin'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            nome,
            preco: Number(preco),
            precoOriginal: precoOriginal ? Number(precoOriginal) : null,
            stripePriceId,
            periodo,
            popular,
            allowPix,
            ativo,
            beneficios,
            materiasIds
        });
    };

    const addBeneficio = () => {
        if (novoBeneficio.trim()) {
            setBeneficios([...beneficios, novoBeneficio.trim()]);
            setNovoBeneficio('');
        }
    };

    const removeBeneficio = (index: number) => {
        setBeneficios(beneficios.filter((_, i) => i !== index));
    };

    const toggleMateria = (id: number) => {
        setMateriasIds(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={planoParaEditar ? "Editar Plano" : "Novo Plano"} size="2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Coluna Esquerda: Dados Principais */}
                    <div className="lg:col-span-5 space-y-5">
                        <Input
                            label="Nome do Plano"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            placeholder="Ex: Plano Mensal"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-primary">Preço (cents)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-lexend text-text-primary"
                                    value={preco}
                                    onChange={(e) => setPreco(Number(e.target.value))}
                                    required
                                    placeholder="2990"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-primary">Preço Original (cents)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-lexend text-text-primary"
                                    value={precoOriginal ?? ''}
                                    onChange={(e) => setPrecoOriginal(e.target.value ? Number(e.target.value) : null)}
                                    placeholder="4000 (opcional)"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-primary">Período</label>
                            <select
                                className="w-full px-4 py-3 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-lexend text-text-primary"
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value as 'MENSAL' | 'ANUAL')}
                            >
                                <option value="MENSAL">Mensal</option>
                                <option value="ANUAL">Anual</option>
                            </select>
                        </div>

                        <Input
                            label="ID do Preço no Stripe"
                            value={stripePriceId}
                            onChange={(e) => setStripePriceId(e.target.value)}
                            required
                            placeholder="price_..."
                        />

                        {/* Toggles */}
                        <div className="flex flex-col gap-3 p-4 bg-bg-secondary/50 rounded-xl border border-border-light">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Mais Popular</span>
                                <div className="relative">
                                    <input type="checkbox" className="hidden" checked={popular} onChange={(e) => setPopular(e.target.checked)} />
                                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${popular ? 'bg-primary' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${popular ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Aceita PIX</span>
                                <div className="relative">
                                    <input type="checkbox" className="hidden" checked={allowPix} onChange={(e) => setAllowPix(e.target.checked)} />
                                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${allowPix ? 'bg-primary' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${allowPix ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Ativo</span>
                                <div className="relative">
                                    <input type="checkbox" className="hidden" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
                                    <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${ativo ? 'bg-primary' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${ativo ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Coluna Direita: Benefícios e Matérias */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {/* Benefícios */}
                        <div className="flex flex-col gap-3 flex-1">
                            <label className="text-sm font-bold text-text-primary flex items-center justify-between">
                                Benefícios do Plano
                                <span className="text-xs font-normal text-text-tertiary">{beneficios.length} adicionados</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 bg-bg-secondary border border-border-light rounded-xl focus:outline-none focus:border-primary text-sm"
                                    placeholder="Ex: Acesso ilimitado..."
                                    value={novoBeneficio}
                                    onChange={(e) => setNovoBeneficio(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBeneficio())}
                                />
                                <button type="button" onClick={addBeneficio} className="p-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors shadow-sm">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="bg-bg-secondary/30 rounded-xl border border-border-light p-2 min-h-[120px] max-h-[180px] overflow-y-auto">
                                <ul className="space-y-1">
                                    {beneficios.map((ben, index) => (
                                        <li key={index} className="flex items-center justify-between px-3 py-2 bg-white rounded-lg text-sm group border border-transparent hover:border-border-light shadow-sm">
                                            <span className="text-text-primary">{ben}</span>
                                            <button type="button" onClick={() => removeBeneficio(index)} className="text-text-tertiary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={14} />
                                            </button>
                                        </li>
                                    ))}
                                    {beneficios.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-text-tertiary opacity-50">
                                            <span className="text-xs italic">Nenhum benefício adicionado</span>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Matérias */}
                        <div className="flex flex-col gap-3 flex-1">
                            <label className="text-sm font-bold text-text-primary flex items-center justify-between">
                                Matérias Inclusas
                                <span className="text-xs font-normal text-text-tertiary">{materiasIds.length} selecionadas</span>
                            </label>
                            <div className="bg-bg-secondary/30 rounded-xl border border-border-light p-3 min-h-[150px] max-h-[250px] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {materias.map((materia) => (
                                        <div
                                            key={materia.id}
                                            onClick={() => toggleMateria(materia.id)}
                                            className={`cursor-pointer px-3 py-2.5 rounded-lg border text-sm transition-all flex items-center gap-2 group ${materiasIds.includes(materia.id)
                                                ? 'border-primary bg-primary/10 text-primary font-bold'
                                                : 'border-border-light bg-white text-text-secondary hover:border-primary/30 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${materiasIds.includes(materia.id) ? 'bg-primary border-primary' : 'border-border-light group-hover:border-primary/50'
                                                }`}>
                                                {materiasIds.includes(materia.id) && <Check size={10} className="text-white" />}
                                            </div>
                                            <span className="truncate">{materia.nome}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-border-light gap-3">
                    <Botao variant="outline" onClick={onClose} type="button">
                        Cancelar
                    </Botao>
                    <Botao
                        type="submit"
                        isLoading={mutation.isPending}
                        leftIcon={Save}
                    >
                        {planoParaEditar ? 'Salvar Plano' : 'Criar Plano'}
                    </Botao>
                </div>
            </form>
        </Modal>
    );
}

