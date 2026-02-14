'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, User, Mail, GraduationCap, Calendar, 
    Trophy, Flame, BookOpen, Star, Pencil, Check, X, 
    Lock, Eye, EyeOff
} from 'lucide-react';
import { usePerfilAluno, useAtualizarPerfil, UpdatePerfilData } from '@/hooks/usePerfilAluno';
import PerfilSkeleton from '@/app/components/Skeleton/PerfilSkeleton';

const NIVEL_ENSINO_LABEL: Record<string, string> = {
    EF: 'Ensino Fundamental',
    EM: 'Ensino Médio',
    SUPERIOR: 'Ensino Superior',
};

export default function PerfilAlunoPage() {
    const router = useRouter();
    const { data: perfil, isLoading, error } = usePerfilAluno();
    const { mutate: atualizarPerfil, isPending: isSaving } = useAtualizarPerfil();

    const [editando, setEditando] = useState(false);
    const [editSenha, setEditSenha] = useState(false);
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);

    const [form, setForm] = useState<UpdatePerfilData>({});
    const [senhaForm, setSenhaForm] = useState({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

    const iniciarEdicao = () => {
        setForm({
            nome: perfil?.nome || '',
            anoEscolar: perfil?.anoEscolar || '',
            DT_nascimento: perfil?.DT_nascimento ? perfil.DT_nascimento.split('T')[0] : '',
        });
        setEditando(true);
        setMensagem(null);
    };

    const cancelarEdicao = () => {
        setEditando(false);
        setForm({});
        setMensagem(null);
    };

    const salvarPerfil = () => {
        atualizarPerfil(form, {
            onSuccess: () => {
                setEditando(false);
                setMensagem({ tipo: 'sucesso', texto: 'Perfil atualizado com sucesso! 🎉' });
                setTimeout(() => setMensagem(null), 3000);
            },
            onError: (err) => {
                setMensagem({ tipo: 'erro', texto: err.message || 'Erro ao atualizar perfil' });
            }
        });
    };

    const salvarSenha = () => {
        if (senhaForm.novaSenha !== senhaForm.confirmarSenha) {
            setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem!' });
            return;
        }
        if (senhaForm.novaSenha.length < 6) {
            setMensagem({ tipo: 'erro', texto: 'A nova senha precisa ter pelo menos 6 caracteres!' });
            return;
        }
        atualizarPerfil({ senhaAtual: senhaForm.senhaAtual, novaSenha: senhaForm.novaSenha }, {
            onSuccess: () => {
                setEditSenha(false);
                setSenhaForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' });
                setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso! 🔒' });
                setTimeout(() => setMensagem(null), 3000);
            },
            onError: () => {
                setMensagem({ tipo: 'erro', texto: 'Senha atual incorreta!' });
            }
        });
    };

    if (isLoading) {
        return <PerfilSkeleton />;
    }

    if (error || !perfil) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Ops! Não conseguimos carregar o perfil.</p>
                    <button 
                        onClick={() => router.back()} 
                        className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    const dataCriacao = new Date(perfil.criadoEm).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    const dataNascimento = perfil.DT_nascimento 
        ? new Date(perfil.DT_nascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'Não informada';

    return (
        <div className="w-full min-h-screen">
            {/* Header */}
            <div className="w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-4">
                    <button 
                        onClick={() => router.back()} 
                        className="size-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Meu Perfil</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-8 flex flex-col gap-6">
                {/* Mensagem de feedback */}
                {mensagem && (
                    <div className={`px-5 py-3 rounded-xl text-sm font-medium ${
                        mensagem.tipo === 'sucesso' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                        {mensagem.texto}
                    </div>
                )}

                {/* Avatar & Nome Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="size-24 rounded-full bg-linear-to-br from-cyan-400 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-200/50">
                            <span className="text-4xl font-bold text-white">
                                {perfil.nome.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            {editando ? (
                                <input
                                    type="text"
                                    value={form.nome || ''}
                                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                                    className="text-2xl font-bold text-gray-800 border-b-2 border-cyan-400 outline-none bg-transparent w-full"
                                    placeholder="Seu nome"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-800">{perfil.nome}</h2>
                            )}
                            <p className="text-gray-500 mt-1">{perfil.anoEscolar}º ano • {NIVEL_ENSINO_LABEL[perfil.nivelEnsino] || perfil.nivelEnsino}</p>
                            {perfil.planoAtivo && (
                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                                    <Star size={12} fill="currentColor" />
                                    {perfil.planoAtivo}
                                </span>
                            )}
                        </div>

                        {!editando ? (
                            <button
                                onClick={iniciarEdicao}
                                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors text-sm cursor-pointer"
                            >
                                <Pencil size={16} />
                                Editar
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={salvarPerfil}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors text-sm cursor-pointer disabled:opacity-50"
                                >
                                    <Check size={16} />
                                    {isSaving ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button
                                    onClick={cancelarEdicao}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard 
                        icone={<BookOpen size={22} />} 
                        cor="#00ccf0" 
                        titulo="Conteúdos" 
                        valor={`${perfil.estatisticas.conteudosConcluidos}/${perfil.estatisticas.totalConteudos}`} 
                    />
                    <StatCard 
                        icone={<Trophy size={22} />} 
                        cor="#fbbf24" 
                        titulo="Média Geral" 
                        valor={`${perfil.estatisticas.mediaGeral}%`} 
                    />
                    <StatCard 
                        icone={<Flame size={22} />} 
                        cor="#f97316" 
                        titulo="Ofensiva" 
                        valor={`${perfil.estatisticas.ofensiva} dias`} 
                    />
                    <StatCard 
                        icone={<Star size={22} />} 
                        cor="#a78bfa" 
                        titulo="Membro desde" 
                        valor={new Date(perfil.criadoEm).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })} 
                    />
                </div>

                {/* Informações pessoais + Segurança (lado a lado) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-5">Informações Pessoais</h3>
                    <div className="space-y-4">
                        <InfoRow 
                            icone={<Mail size={18} />} 
                            label="E-mail" 
                            valor={perfil.email} 
                        />
                        <InfoRow 
                            icone={<GraduationCap size={18} />} 
                            label="Ano Escolar" 
                            valor={editando ? undefined : `${perfil.anoEscolar}º ano`}
                            editMode={editando}
                            editComponent={
                                <select
                                    value={form.anoEscolar || ''}
                                    onChange={(e) => setForm({ ...form, anoEscolar: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan-400"
                                >
                                    {['1','2','3','4','5','6','7','8','9'].map(ano => (
                                        <option key={ano} value={ano}>{ano}º ano</option>
                                    ))}
                                </select>
                            }
                        />
                        <InfoRow 
                            icone={<Calendar size={18} />} 
                            label="Data de Nascimento" 
                            valor={editando ? undefined : dataNascimento}
                            editMode={editando}
                            editComponent={
                                <input
                                    type="date"
                                    value={form.DT_nascimento || ''}
                                    onChange={(e) => setForm({ ...form, DT_nascimento: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-cyan-400"
                                />
                            }
                        />
                        <InfoRow 
                            icone={<User size={18} />} 
                            label="Membro desde" 
                            valor={dataCriacao} 
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-800">Segurança</h3>
                        {!editSenha && (
                            <button
                                onClick={() => { setEditSenha(true); setMensagem(null); }}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer"
                            >
                                <Lock size={14} />
                                Alterar Senha
                            </button>
                        )}
                    </div>

                    {editSenha ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Senha Atual</label>
                                <div className="relative">
                                    <input
                                        type={showSenhaAtual ? 'text' : 'password'}
                                        value={senhaForm.senhaAtual}
                                        onChange={(e) => setSenhaForm({ ...senhaForm, senhaAtual: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 pr-10"
                                        placeholder="Digite sua senha atual"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nova Senha</label>
                                <div className="relative">
                                    <input
                                        type={showNovaSenha ? 'text' : 'password'}
                                        value={senhaForm.novaSenha}
                                        onChange={(e) => setSenhaForm({ ...senhaForm, novaSenha: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400 pr-10"
                                        placeholder="Digite a nova senha"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    value={senhaForm.confirmarSenha}
                                    onChange={(e) => setSenhaForm({ ...senhaForm, confirmarSenha: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-cyan-400"
                                    placeholder="Confirme a nova senha"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={salvarSenha}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors text-sm cursor-pointer disabled:opacity-50"
                                >
                                    <Check size={16} />
                                    {isSaving ? 'Salvando...' : 'Salvar Senha'}
                                </button>
                                <button
                                    onClick={() => { 
                                        setEditSenha(false); 
                                        setSenhaForm({ senhaAtual: '', novaSenha: '', confirmarSenha: '' }); 
                                        setMensagem(null);
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                                >
                                    <X size={16} />
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Sua senha protege sua conta. Você pode alterá-la a qualquer momento.</p>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

/* ========== Sub-componentes ========== */

function StatCard({ icone, cor, titulo, valor }: { icone: React.ReactNode; cor: string; titulo: string; valor: string }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center gap-2 text-center">
            <div 
                className="size-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${cor}15`, color: cor }}
            >
                {icone}
            </div>
            <p className="text-xs font-semibold text-gray-400">{titulo}</p>
            <p className="text-lg font-bold text-gray-800">{valor}</p>
        </div>
    );
}

function InfoRow({ icone, label, valor, editMode, editComponent }: { 
    icone: React.ReactNode; 
    label: string; 
    valor?: string; 
    editMode?: boolean;
    editComponent?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                {icone}
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-sm font-semibold text-gray-500 sm:w-40">{label}</span>
                {editMode && editComponent ? (
                    editComponent
                ) : (
                    <span className="text-sm font-medium text-gray-800">{valor}</span>
                )}
            </div>
        </div>
    );
}
