'use client';

import AdminSidebar from "@/app/components/AdminSidebar";
import { Botao } from "@/app/components/Botao";
import { Input } from "@/app/components/Input";
import LoadingScreen from "@/app/components/LoadingScreen";
import RichTextEditor from "@/app/components/RichTextEditor";
import useConteudoGerenciar, {
    type SalvarDadosPayload
} from "@/hooks/useConteudoGerenciar";
import * as LucideIcons from "lucide-react";
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Eye,
    FileText,
    FileUp,
    HelpCircle,
    Link as LinkIcon,
    Plus,
    Save,
    Trash2,
    Type,
    Upload,
    Video,
    XCircle
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode
} from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════════════════ */

function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

function getIconComponent(iconName?: string | null, size = 20): ReactNode {
    if (!iconName) return <BookOpen size={size} />;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon size={size} /> : <BookOpen size={size} />;
}

const TIPO_LABEL: Record<string, string> = {
    VIDEO: "Vídeo", PDF: "PDF", QUIZ: "Quiz", TEXTO: "Texto",
};
const TIPO_ICONE: Record<string, ReactNode> = {
    VIDEO: <Video size={20} />, PDF: <FileText size={20} />, QUIZ: <HelpCircle size={20} />, TEXTO: <Type size={20} />,
};
const TIPO_COR: Record<string, string> = {
    VIDEO: "text-blue-500 bg-blue-50",
    PDF: "text-orange-500 bg-orange-50",
    QUIZ: "text-purple-500 bg-purple-50",
    TEXTO: "text-green-500 bg-green-50",
};

/* ═══════════════════════════════════════════════════════════════════════════
   Toast
   ═══════════════════════════════════════════════════════════════════════════ */

function useToast() {
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const show = useCallback((msg: string, type: "success" | "error" = "error") => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast({ msg, type });
        timerRef.current = setTimeout(() => setToast(null), 4000);
    }, []);

    const dismiss = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast(null);
    }, []);

    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
    return { toast, show, dismiss };
}

/* ═══════════════════════════════════════════════════════════════════════════
   Editor de Vídeo
   ═══════════════════════════════════════════════════════════════════════════ */

interface VideoEditorProps {
    videoUrl: string;
    onVideoUrlChange: (url: string) => void;
    duracao: string;
    onDuracaoChange: (d: string) => void;
    resumo: string;
    onResumoChange: (html: string) => void;
    onUpload: (file: File) => void;
    isUploading: boolean;
    uploadProgress: number | null;
}

function VideoEditor({ videoUrl, onVideoUrlChange, duracao, onDuracaoChange, resumo, onResumoChange, onUpload, isUploading, uploadProgress }: VideoEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) onUpload(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            {/* Upload area */}
            <div>
                <label className="text-sm text-text-primary font-medium font-lexend mb-2 block">
                    Arquivo de Vídeo
                </label>
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        dragOver
                            ? 'border-primary bg-primary/5'
                            : videoUrl
                                ? 'border-green-300 bg-green-50/30'
                                : 'border-border-light hover:border-primary/40 hover:bg-bg-secondary'
                    }`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-text-secondary font-lexend">
                                Enviando vídeo... {uploadProgress !== null ? `${uploadProgress}%` : ''}
                            </p>
                            {uploadProgress !== null && (
                                <div className="w-full max-w-xs h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    ) : videoUrl ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle2 size={28} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary font-lexend">Vídeo enviado com sucesso</p>
                                <p className="text-xs text-text-tertiary font-lexend mt-1">Clique para substituir o arquivo</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Upload size={28} className="text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary font-lexend">
                                    Arraste o vídeo aqui ou clique para selecionar
                                </p>
                                <p className="text-xs text-text-tertiary font-lexend mt-1">
                                    Formatos: MP4, WebM, MOV
                                </p>
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Preview */}
            {videoUrl && (
                <div>
                    <button
                        type="button"
                        onClick={() => setShowPreview((v) => !v)}
                        className="flex items-center gap-2 text-sm text-primary font-bold hover:underline cursor-pointer mb-2"
                    >
                        <Eye size={14} />
                        {showPreview ? 'Esconder preview' : 'Ver preview'}
                    </button>
                    {showPreview && (
                        <div className="aspect-video rounded-xl overflow-hidden border border-border-light bg-black">
                            <video src={videoUrl} controls className="w-full h-full" />
                        </div>
                    )}
                </div>
            )}

            {/* Duração */}
            <Input
                label="Duração (segundos)"
                placeholder="Ex: 600 (10 minutos)"
                value={duracao}
                onChange={(e) => onDuracaoChange(e.target.value.replace(/\D/g, ''))}
                numericOnly
                size="md"
                helperText="Duração do vídeo em segundos (opcional)"
            />

            {/* Resumo */}
            <RichTextEditor
                label="Resumo do Vídeo (opcional)"
                value={resumo}
                onChange={onResumoChange}
                placeholder="Escreva um resumo do conteúdo do vídeo..."
                minHeight={150}
                helperText="Resumo em texto que acompanha o vídeo"
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Editor de PDF
   ═══════════════════════════════════════════════════════════════════════════ */

interface PdfEditorProps {
    pdfUrl: string;
    onPdfUrlChange: (url: string) => void;
    possuiGabarito: boolean;
    onGabaritoChange: (v: boolean) => void;
    onUpload: (file: File) => void;
    isUploading: boolean;
}

function PdfEditor({ pdfUrl, onPdfUrlChange, possuiGabarito, onGabaritoChange, onUpload, isUploading }: PdfEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') onUpload(file);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            {/* Upload area */}
            <div>
                <label className="text-sm text-text-primary font-medium font-lexend mb-2 block">
                    Arquivo PDF
                </label>
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                        dragOver
                            ? 'border-primary bg-primary/5'
                            : pdfUrl
                                ? 'border-green-300 bg-green-50/30'
                                : 'border-border-light hover:border-primary/40 hover:bg-bg-secondary'
                    }`}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-text-secondary font-lexend">Enviando arquivo...</p>
                        </div>
                    ) : pdfUrl ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                                <CheckCircle2 size={28} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary font-lexend">PDF enviado com sucesso</p>
                                <p className="text-xs text-text-tertiary font-lexend mt-1">Clique para substituir o arquivo</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center">
                                <FileUp size={28} className="text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary font-lexend">
                                    Arraste o PDF aqui ou clique para selecionar
                                </p>
                                <p className="text-xs text-text-tertiary font-lexend mt-1">
                                    Tamanho máximo: 200MB
                                </p>
                            </div>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </div>

            {/* URL manual */}
            <Input
                label="Ou cole a URL do PDF"
                placeholder="https://exemplo.com/arquivo.pdf"
                value={pdfUrl}
                onChange={(e) => onPdfUrlChange(e.target.value)}
                leftIcon={LinkIcon}
                size="md"
                helperText="URL direta para o arquivo PDF"
            />

            {/* Preview */}
            {pdfUrl && (
                <div className="rounded-xl overflow-hidden border border-border-light bg-gray-50">
                    <div className="p-3 bg-white border-b border-border-light flex items-center gap-2">
                        <FileText size={16} className="text-orange-500" />
                        <span className="text-sm font-bold text-text-primary font-lexend">Preview do PDF</span>
                    </div>
                    <iframe
                        src={pdfUrl}
                        className="w-full h-96"
                        title="Preview do PDF"
                    />
                </div>
            )}

            {/* Gabarito checkbox */}
            <label className="flex items-center gap-3 p-4 rounded-xl border border-border-light hover:bg-bg-secondary transition-colors cursor-pointer group">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    possuiGabarito
                        ? 'bg-primary border-primary'
                        : 'border-border-light group-hover:border-primary/40'
                }`}>
                    {possuiGabarito && <Check size={14} className="text-white" />}
                </div>
                <input
                    type="checkbox"
                    checked={possuiGabarito}
                    onChange={(e) => onGabaritoChange(e.target.checked)}
                    className="hidden"
                />
                <div>
                    <p className="text-sm font-bold text-text-primary font-lexend">Possui Gabarito</p>
                    <p className="text-xs text-text-tertiary font-lexend">Marque se este PDF contém gabarito de exercícios</p>
                </div>
            </label>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Editor de Texto
   ═══════════════════════════════════════════════════════════════════════════ */

interface TextoEditorProps {
    corpo: string;
    onCorpoChange: (html: string) => void;
    tempoLeitura: string;
    onTempoLeituraChange: (v: string) => void;
}

function TextoEditor({ corpo, onCorpoChange, tempoLeitura, onTempoLeituraChange }: TextoEditorProps) {
    return (
        <div className="space-y-6">
            <RichTextEditor
                label="Conteúdo do Texto"
                value={corpo}
                onChange={onCorpoChange}
                placeholder="Escreva o conteúdo educacional aqui. Use a barra de ferramentas acima para formatar o texto..."
                minHeight={350}
                maxHeight={800}
            />

            <Input
                label="Tempo de leitura (min)"
                placeholder="Ex: 5"
                value={tempoLeitura}
                onChange={(e) => onTempoLeituraChange(e.target.value.replace(/\D/g, ''))}
                numericOnly
                size="md"
                helperText="Tempo estimado de leitura em minutos (opcional)"
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Editor de Quiz
   ═══════════════════════════════════════════════════════════════════════════ */

interface QuestaoForm {
    key: string;
    enunciado: string;
    alternativas: AlternativaForm[];
    collapsed: boolean;
}

interface AlternativaForm {
    key: string;
    texto: string;
    correta: boolean;
    justificativa: string;
}

function newAlternativa(correta = false): AlternativaForm {
    return { key: crypto.randomUUID(), texto: '', correta, justificativa: '' };
}

function newQuestao(): QuestaoForm {
    return {
        key: crypto.randomUUID(),
        enunciado: '',
        alternativas: [
            newAlternativa(true),
            newAlternativa(),
            newAlternativa(),
            newAlternativa(),
        ],
        collapsed: false,
    };
}

interface QuizEditorProps {
    questoes: QuestaoForm[];
    onChange: (questoes: QuestaoForm[]) => void;
}

function QuizEditor({ questoes, onChange }: QuizEditorProps) {
    const addQuestao = () => {
        onChange([...questoes, newQuestao()]);
    };

    const removeQuestao = (idx: number) => {
        onChange(questoes.filter((_, i) => i !== idx));
    };

    const updateQuestao = (idx: number, updates: Partial<QuestaoForm>) => {
        const updated = [...questoes];
        updated[idx] = { ...updated[idx], ...updates };
        onChange(updated);
    };

    const toggleCollapse = (idx: number) => {
        const updated = [...questoes];
        updated[idx] = { ...updated[idx], collapsed: !updated[idx].collapsed };
        onChange(updated);
    };

    const addAlternativa = (qIdx: number) => {
        const updated = [...questoes];
        updated[qIdx] = {
            ...updated[qIdx],
            alternativas: [...updated[qIdx].alternativas, newAlternativa()],
        };
        onChange(updated);
    };

    const removeAlternativa = (qIdx: number, aIdx: number) => {
        const updated = [...questoes];
        updated[qIdx] = {
            ...updated[qIdx],
            alternativas: updated[qIdx].alternativas.filter((_, i) => i !== aIdx),
        };
        onChange(updated);
    };

    const updateAlternativa = (qIdx: number, aIdx: number, updates: Partial<AlternativaForm>) => {
        const updated = [...questoes];
        const alts = [...updated[qIdx].alternativas];
        alts[aIdx] = { ...alts[aIdx], ...updates };

        // Se marcou esta como correta, desmarca as outras
        if (updates.correta) {
            alts.forEach((a, i) => {
                if (i !== aIdx) a.correta = false;
            });
        }

        updated[qIdx] = { ...updated[qIdx], alternativas: alts };
        onChange(updated);
    };

    const moveQuestao = (idx: number, dir: 'up' | 'down') => {
        const newIdx = dir === 'up' ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= questoes.length) return;
        const updated = [...questoes];
        [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
        onChange(updated);
    };

    const LETTER = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm text-text-primary font-medium font-lexend">
                    Questões do Quiz
                </label>
                <span className="text-xs text-text-tertiary font-lexend font-bold">
                    {questoes.length} {questoes.length === 1 ? 'questão' : 'questões'}
                </span>
            </div>

            {questoes.map((q, qIdx) => (
                <div
                    key={q.key}
                    className="border border-border-light rounded-xl overflow-hidden bg-white"
                >
                    {/* Header da questão */}
                    <div
                        className="flex items-center gap-3 px-4 py-3 bg-bg-secondary/50 border-b border-border-light cursor-pointer"
                        onClick={() => toggleCollapse(qIdx)}
                    >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <span className="text-sm font-black">{qIdx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-primary font-lexend truncate">
                                {q.enunciado || `Questão ${qIdx + 1}`}
                            </p>
                            <p className="text-[10px] text-text-tertiary font-lexend">
                                {q.alternativas.length} alternativas
                                {q.alternativas.some(a => a.correta) ? ' • Resposta definida' : ' • Sem resposta correta'}
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); moveQuestao(qIdx, 'up'); }}
                                disabled={qIdx === 0}
                                className="p-1 text-text-tertiary hover:text-primary rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Mover para cima"
                            >
                                <ChevronUp size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); moveQuestao(qIdx, 'down'); }}
                                disabled={qIdx === questoes.length - 1}
                                className="p-1 text-text-tertiary hover:text-primary rounded cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Mover para baixo"
                            >
                                <ChevronDown size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeQuestao(qIdx); }}
                                className="p-1 text-text-tertiary hover:text-brand-red rounded cursor-pointer ml-1"
                                title="Remover questão"
                            >
                                <Trash2 size={14} />
                            </button>
                            {q.collapsed ? <ChevronDown size={16} className="text-text-tertiary" /> : <ChevronUp size={16} className="text-text-tertiary" />}
                        </div>
                    </div>

                    {/* Corpo da questão */}
                    {!q.collapsed && (
                        <div className="p-4 space-y-4">
                            {/* Enunciado */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs text-text-tertiary font-bold uppercase tracking-wider font-lexend">
                                    Enunciado
                                </label>
                                <textarea
                                    value={q.enunciado}
                                    onChange={(e) => updateQuestao(qIdx, { enunciado: e.target.value })}
                                    placeholder="Digite o enunciado da questão..."
                                    rows={3}
                                    className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20 transition-all duration-200 resize-none font-lexend"
                                />
                            </div>

                            {/* Alternativas */}
                            <div className="space-y-2">
                                <label className="text-xs text-text-tertiary font-bold uppercase tracking-wider font-lexend">
                                    Alternativas
                                </label>

                                {q.alternativas.map((alt, aIdx) => (
                                    <div key={alt.key} className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            {/* Letra + toggle correto */}
                                            <button
                                                type="button"
                                                onClick={() => updateAlternativa(qIdx, aIdx, { correta: true })}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer text-sm font-black mt-0.5 ${
                                                    alt.correta
                                                        ? 'bg-green-500 text-white shadow-sm'
                                                        : 'bg-gray-100 text-text-tertiary hover:bg-green-50 hover:text-green-600'
                                                }`}
                                                title={alt.correta ? 'Resposta correta' : 'Marcar como correta'}
                                            >
                                                {alt.correta ? <Check size={16} /> : LETTER[aIdx]}
                                            </button>

                                            {/* Texto da alternativa */}
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={alt.texto}
                                                    onChange={(e) => updateAlternativa(qIdx, aIdx, { texto: e.target.value })}
                                                    placeholder={`Alternativa ${LETTER[aIdx]}`}
                                                    className="w-full rounded-lg border border-border-light bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20 transition-all duration-200 font-lexend"
                                                />
                                            </div>

                                            {/* Remover */}
                                            <button
                                                type="button"
                                                onClick={() => removeAlternativa(qIdx, aIdx)}
                                                disabled={q.alternativas.length <= 2}
                                                className="p-2 text-text-tertiary hover:text-brand-red rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 mt-0.5"
                                                title="Remover alternativa"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>

                                        {/* Justificativa */}
                                        <div className="ml-11">
                                            <input
                                                type="text"
                                                value={alt.justificativa}
                                                onChange={(e) => updateAlternativa(qIdx, aIdx, { justificativa: e.target.value })}
                                                placeholder="Justificativa (opcional) — explicação para o aluno"
                                                className="w-full rounded-lg border border-border-lightest bg-bg-secondary/50 px-3 py-1.5 text-xs text-text-secondary placeholder:text-text-tertiary/60 focus:outline-none focus:ring-2 focus:border-primary focus:ring-primary/10 transition-all duration-200 font-lexend"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {/* Adicionar alternativa */}
                                {q.alternativas.length < 8 && (
                                    <button
                                        type="button"
                                        onClick={() => addAlternativa(qIdx)}
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border-light text-text-tertiary hover:text-primary hover:border-primary/40 transition-colors cursor-pointer text-xs font-bold font-lexend"
                                    >
                                        <Plus size={14} />
                                        Adicionar Alternativa
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Adicionar questão */}
            <button
                type="button"
                onClick={addQuestao}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-border-light hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group"
            >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={20} />
                </div>
                <span className="text-sm font-bold text-text-primary font-lexend">
                    Adicionar Questão
                </span>
            </button>

            {questoes.length === 0 && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-3">
                        <HelpCircle size={28} className="text-purple-400" />
                    </div>
                    <p className="text-sm text-text-tertiary font-lexend">
                        Nenhuma questão adicionada ainda. Clique no botão acima para começar.
                    </p>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Página Principal — Editor de Conteúdo
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ConteudoEditorPage() {
    const params = useParams();
    const router = useRouter();
    const materiaId = Number(params.id);
    const conteudoId = Number(params.conteudoId);

    const {
        data: conteudo,
        isLoading,
        error,
        salvar,
        upload,
        uploadProgress,
    } = useConteudoGerenciar(conteudoId);

    const toast = useToast();

    // ─── Estado do formulário ────────────────────────────────────────────────
    const [titulo, setTitulo] = useState('');
    const [tempoMin, setTempoMin] = useState('');

    // Video
    const [videoUrl, setVideoUrl] = useState('');
    const [videoDuracao, setVideoDuracao] = useState('');
    const [videoResumo, setVideoResumo] = useState('');

    // PDF
    const [pdfUrl, setPdfUrl] = useState('');
    const [possuiGabarito, setPossuiGabarito] = useState(false);

    // Texto
    const [corpo, setCorpo] = useState('');
    const [tempoLeitura, setTempoLeitura] = useState('');

    // Quiz
    const [questoes, setQuestoes] = useState<QuestaoForm[]>([]);

    // Track if initialized
    const [initialized, setInitialized] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const skipFirstChangeRef = useRef(true);

    // ─── Inicializar dados ───────────────────────────────────────────────────
    useEffect(() => {
        if (conteudo && !initialized) {
            setTitulo(conteudo.titulo || '');
            setTempoMin(conteudo.tempoMin ? String(conteudo.tempoMin) : '');

            switch (conteudo.tipo) {
                case 'VIDEO':
                    setVideoUrl(conteudo.video?.url || '');
                    setVideoDuracao(conteudo.video?.duracao ? String(conteudo.video.duracao) : '');
                    setVideoResumo(conteudo.video?.resumo?.corpo || '');
                    break;
                case 'PDF':
                    setPdfUrl(conteudo.pdf?.url || '');
                    setPossuiGabarito(conteudo.pdf?.possuiGabarito || false);
                    break;
                case 'TEXTO':
                    setCorpo(conteudo.texto?.corpo || '');
                    setTempoLeitura(conteudo.texto?.tempoLeitura ? String(conteudo.texto.tempoLeitura) : '');
                    break;
                case 'QUIZ':
                    if (conteudo.quiz?.questoes) {
                        setQuestoes(
                            conteudo.quiz.questoes.map((q) => ({
                                key: crypto.randomUUID(),
                                enunciado: q.enunciado,
                                alternativas: q.alternativas.map((a) => ({
                                    key: crypto.randomUUID(),
                                    texto: a.texto,
                                    correta: a.correta,
                                    justificativa: a.justificativa || '',
                                })),
                                collapsed: false,
                            })),
                        );
                    }
                    break;
            }

            setInitialized(true);
        }
    }, [conteudo, initialized]);

    // Track changes (skip the first trigger after initialization)
    useEffect(() => {
        if (!initialized) return;
        if (skipFirstChangeRef.current) {
            skipFirstChangeRef.current = false;
            return;
        }
        setHasChanges(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titulo, tempoMin, videoUrl, videoDuracao, videoResumo, pdfUrl, possuiGabarito, corpo, tempoLeitura, questoes]);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const handleUploadPdf = useCallback(async (file: File) => {
        try {
            const result = await upload.mutateAsync({ file, pasta: 'pdf' });
            setPdfUrl(result.url);
            toast.show('PDF enviado com sucesso!', 'success');
        } catch (err: any) {
            toast.show(err?.message || 'Erro ao enviar o PDF.', 'error');
        }
    }, [upload, toast]);

    const handleUploadVideo = useCallback(async (file: File) => {
        try {
            const result = await upload.mutateAsync({ file, pasta: 'video' });
            setVideoUrl(result.url);
            toast.show('Vídeo enviado com sucesso!', 'success');
        } catch (err: any) {
            toast.show(err?.message || 'Erro ao enviar o vídeo.', 'error');
        }
    }, [upload, toast]);

    const handleSalvar = useCallback(async () => {
        if (!conteudo) return;

        if (!titulo.trim()) {
            toast.show('O título é obrigatório.', 'error');
            return;
        }

        const dados: SalvarDadosPayload = {
            titulo: titulo.trim(),
            tempoMin: tempoMin ? parseInt(tempoMin, 10) : undefined,
        };

        switch (conteudo.tipo) {
            case 'VIDEO':
                if (!videoUrl.trim()) {
                    toast.show('O vídeo é obrigatório. Envie um arquivo de vídeo.', 'error');
                    return;
                }
                dados.videoUrl = videoUrl.trim();
                dados.videoDuracao = videoDuracao ? parseInt(videoDuracao, 10) : undefined;
                dados.videoResumo = videoResumo || undefined;
                break;

            case 'PDF':
                if (!pdfUrl.trim()) {
                    toast.show('O PDF é obrigatório. Envie um arquivo ou cole a URL.', 'error');
                    return;
                }
                dados.pdfUrl = pdfUrl.trim();
                dados.possuiGabarito = possuiGabarito;
                break;

            case 'TEXTO':
                if (!corpo.trim()) {
                    toast.show('O conteúdo do texto é obrigatório.', 'error');
                    return;
                }
                dados.corpo = corpo;
                dados.tempoLeitura = tempoLeitura ? parseInt(tempoLeitura, 10) : undefined;
                break;

            case 'QUIZ':
                if (questoes.length === 0) {
                    toast.show('Adicione pelo menos uma questão.', 'error');
                    return;
                }
                for (let i = 0; i < questoes.length; i++) {
                    const q = questoes[i];
                    if (!q.enunciado.trim()) {
                        toast.show(`Questão ${i + 1}: o enunciado é obrigatório.`, 'error');
                        return;
                    }
                    if (q.alternativas.length < 2) {
                        toast.show(`Questão ${i + 1}: adicione pelo menos 2 alternativas.`, 'error');
                        return;
                    }
                    if (!q.alternativas.some(a => a.correta)) {
                        toast.show(`Questão ${i + 1}: marque uma alternativa como correta.`, 'error');
                        return;
                    }
                    for (let j = 0; j < q.alternativas.length; j++) {
                        if (!q.alternativas[j].texto.trim()) {
                            toast.show(`Questão ${i + 1}, Alternativa ${j + 1}: o texto é obrigatório.`, 'error');
                            return;
                        }
                    }
                }
                dados.questoes = questoes.map((q) => ({
                    enunciado: q.enunciado,
                    alternativas: q.alternativas.map((a) => ({
                        texto: a.texto,
                        correta: a.correta,
                        justificativa: a.justificativa || undefined,
                    })),
                }));
                break;
        }

        try {
            await salvar.mutateAsync(dados);
            setHasChanges(false);
            toast.show('Conteúdo salvo com sucesso!', 'success');
        } catch (err: any) {
            console.error(err);
            toast.show(err?.response?.data?.message || 'Erro ao salvar.', 'error');
        }
    }, [conteudo, titulo, tempoMin, videoUrl, videoDuracao, videoResumo, pdfUrl, possuiGabarito, corpo, tempoLeitura, questoes, salvar, toast]);

    // ─── Derived ─────────────────────────────────────────────────────────────

    const cor = conteudo?.topico?.materia?.cor || '#00ccf0';
    const tipoCor = conteudo ? TIPO_COR[conteudo.tipo] || '' : '';

    // ─── Loading / Error ─────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-row">
                <AdminSidebar />
                <main className="flex flex-1 flex-col overflow-hidden"><LoadingScreen /></main>
            </div>
        );
    }

    if (error || !conteudo) {
        return (
            <div className="w-full h-screen flex flex-row">
                <AdminSidebar />
                <main className="flex flex-1 items-center justify-center">
                    <div className="text-center font-lexend space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <AlertCircle size={28} className="text-brand-red" />
                        </div>
                        <p className="text-brand-red text-lg font-bold">Conteúdo não encontrado</p>
                        <Botao variant="primary" size="md" onClick={() => router.push(`/admin/materias/${materiaId}`)}>
                            Voltar para Matéria
                        </Botao>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />

            <main className="flex flex-1 flex-col overflow-hidden">
                {/* ─── Header ────────────────────────────────────────────────── */}
                <header className="h-16 bg-white border-b border-border-light px-6 flex items-center justify-between shrink-0 font-lexend">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(`/admin/materias/${materiaId}`)}
                            className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                            title="Voltar"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="h-6 w-px bg-border-light" />

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-7 h-7 rounded-md flex items-center justify-center"
                                    style={{ backgroundColor: hexToRgba(cor, 0.1), color: cor }}
                                >
                                    {getIconComponent(conteudo.topico.materia.icone, 14)}
                                </div>
                                <button
                                    onClick={() => router.push(`/admin/materias/${materiaId}`)}
                                    className="text-text-tertiary hover:text-primary transition-colors cursor-pointer font-medium truncate max-w-32"
                                >
                                    {conteudo.topico.materia.nome}
                                </button>
                            </div>
                            <span className="text-text-tertiary">/</span>
                            <span className="text-text-tertiary truncate max-w-32">
                                {conteudo.topico.titulo}
                            </span>
                            <span className="text-text-tertiary">/</span>
                            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-black ${tipoCor}`}>
                                {TIPO_ICONE[conteudo.tipo]}
                                {TIPO_LABEL[conteudo.tipo]}
                            </span>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="flex items-center gap-3">
                        {hasChanges && initialized && (
                            <span className="text-xs text-text-tertiary font-lexend flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                Alterações não salvas
                            </span>
                        )}
                        <Botao
                            variant="primary"
                            size="md"
                            leftIcon={Save}
                            onClick={handleSalvar}
                            isLoading={salvar.isPending}
                            disabled={!hasChanges || !initialized}
                        >
                            Salvar
                        </Botao>
                    </div>
                </header>

                {/* ─── Content ───────────────────────────────────────────────── */}
                <div className="flex-1 bg-bg-secondary overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-8 pb-24 space-y-8">
                        {/* Seção: Info básica */}
                        <section className="bg-white rounded-2xl border border-border-light p-6 space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tipoCor}`}>
                                    {TIPO_ICONE[conteudo.tipo]}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-text-primary font-lexend">
                                        Informações do Conteúdo
                                    </h2>
                                    <p className="text-xs text-text-tertiary font-lexend">
                                        {conteudo.tipo === 'VIDEO' ? 'Configure o vídeo e informações' :
                                         conteudo.tipo === 'PDF' ? 'Envie o PDF e configure' :
                                         conteudo.tipo === 'QUIZ' ? 'Monte as questões do quiz' :
                                         'Escreva o conteúdo de texto'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Título"
                                        placeholder="Ex: Introdução a Funções"
                                        value={titulo}
                                        onChange={(e) => setTitulo(e.target.value)}
                                        size="md"
                                        maxLength={200}
                                    />
                                </div>
                                <Input
                                    label="Tempo estimado (min)"
                                    placeholder="Ex: 15"
                                    value={tempoMin}
                                    onChange={(e) => setTempoMin(e.target.value.replace(/\D/g, ''))}
                                    numericOnly
                                    size="md"
                                    leftIcon={Clock}
                                />
                            </div>
                        </section>

                        {/* Seção: Editor específico do tipo */}
                        <section className="bg-white rounded-2xl border border-border-light p-6">
                            {conteudo.tipo === 'VIDEO' && (
                                <VideoEditor
                                    videoUrl={videoUrl}
                                    onVideoUrlChange={setVideoUrl}
                                    duracao={videoDuracao}
                                    onDuracaoChange={setVideoDuracao}
                                    resumo={videoResumo}
                                    onResumoChange={setVideoResumo}
                                    onUpload={handleUploadVideo}
                                    isUploading={upload.isPending}
                                    uploadProgress={uploadProgress}
                                />
                            )}

                            {conteudo.tipo === 'PDF' && (
                                <PdfEditor
                                    pdfUrl={pdfUrl}
                                    onPdfUrlChange={setPdfUrl}
                                    possuiGabarito={possuiGabarito}
                                    onGabaritoChange={setPossuiGabarito}
                                    onUpload={handleUploadPdf}
                                    isUploading={upload.isPending}
                                />
                            )}

                            {conteudo.tipo === 'TEXTO' && (
                                <TextoEditor
                                    corpo={corpo}
                                    onCorpoChange={setCorpo}
                                    tempoLeitura={tempoLeitura}
                                    onTempoLeituraChange={setTempoLeitura}
                                />
                            )}

                            {conteudo.tipo === 'QUIZ' && (
                                <QuizEditor
                                    questoes={questoes}
                                    onChange={setQuestoes}
                                />
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {/* Toast */}
            {toast.toast && (
                <div
                    onClick={toast.dismiss}
                    className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-lexend text-sm flex items-center gap-3 cursor-pointer animate-in slide-in-from-bottom-4 duration-300 ${
                        toast.toast.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-red-50 border border-red-200 text-red-700"
                    }`}
                >
                    {toast.toast.type === "success"
                        ? <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">✓</span>
                        : <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</span>
                    }
                    {toast.toast.msg}
                </div>
            )}
        </div>
    );
}
