'use client';
import { ChevronDown, FileEdit, Loader2, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import api from "@/services/axios";

interface NotasCardProps {
    conteudoId: number;
    alunoId: number;
}

export default function NotasCard({ conteudoId, alunoId }: NotasCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [texto, setTexto] = useState('');
    const [textoOriginal, setTextoOriginal] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load notes when opened or conteudoId changes
    useEffect(() => {
        if (!conteudoId || !alunoId) return;

        const loadNotes = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/anotacao/${conteudoId}?alunoId=${alunoId}`);
                const t = res.data?.texto || '';
                setTexto(t);
                setTextoOriginal(t);
            } catch (err) {
                console.error('Erro ao carregar anotações', err);
            } finally {
                setLoading(false);
            }
        };

        loadNotes();
    }, [conteudoId, alunoId]);

    const handleSave = useCallback(async () => {
        if (!conteudoId || !alunoId || texto === textoOriginal) return;

        setSaving(true);
        try {
            await api.put(`/anotacao/${conteudoId}?alunoId=${alunoId}`, { texto });
            setTextoOriginal(texto);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            console.error('Erro ao salvar anotação', err);
        } finally {
            setSaving(false);
        }
    }, [conteudoId, alunoId, texto, textoOriginal]);

    const hasChanges = texto !== textoOriginal;

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left group hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <FileEdit className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                    <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">
                        Minhas Anotações
                    </span>
                    {textoOriginal && (
                        <span className="text-xs text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-full">
                            salvas
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>

            {isOpen && (
                <div className="p-4 border-t border-gray-100">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                    ) : (
                        <>
                            <textarea
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                placeholder="Digite suas anotações sobre este conteúdo..."
                                className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                            <div className="flex items-center justify-end mt-2 gap-3">
                                {saved && (
                                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                        <Check size={14} />
                                        Salvo!
                                    </span>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !hasChanges}
                                    className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${hasChanges
                                            ? 'text-primary hover:bg-primary/10'
                                            : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {saving ? (
                                        <Loader2 className="animate-spin" size={14} />
                                    ) : (
                                        <FileEdit size={14} />
                                    )}
                                    {saving ? 'Salvando...' : 'Salvar anotação'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}