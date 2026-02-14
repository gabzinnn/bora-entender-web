'use client';

import AdminSidebar from "@/app/components/AdminSidebar";
import LoadingScreen from "@/app/components/LoadingScreen";
import { Input } from "@/app/components/Input";
import { Botao } from "@/app/components/Botao";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import useMateriaGerenciar, {
    type TopicoGerenciar,
    type ConteudoResumo,
} from "@/hooks/useMateriaGerenciar";
import {
    ArrowLeft,
    Plus,
    GripVertical,
    Pencil,
    Trash2,
    BookOpen,
    ChevronRight,
    ChevronDown,
    FileText,
    Video,
    HelpCircle,
    Type,
    PlusCircle,
    FolderOpen,
    Folder,
    Search,
    ArrowUp,
    ArrowDown,
    Clock,
    Layers,
    Menu,
    PanelLeftClose,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
    type ReactNode,
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

const TIPO_CONTEUDO_OPTIONS = [
    { value: 'VIDEO' as const, label: 'Vídeo', icon: <Video size={16} />, cor: 'text-blue-500 bg-blue-50' },
    { value: 'PDF' as const, label: 'PDF', icon: <FileText size={16} />, cor: 'text-orange-500 bg-orange-50' },
    { value: 'QUIZ' as const, label: 'Quiz', icon: <HelpCircle size={16} />, cor: 'text-purple-500 bg-purple-50' },
    { value: 'TEXTO' as const, label: 'Texto', icon: <Type size={16} />, cor: 'text-green-500 bg-green-50' },
];

const TIPO_LABEL: Record<string, string> = {
    VIDEO: "Vídeo", PDF: "PDF", QUIZ: "Quiz", TEXTO: "Texto",
};
const TIPO_ICONE_SM: Record<string, ReactNode> = {
    VIDEO: <Video size={14} />, PDF: <FileText size={14} />, QUIZ: <HelpCircle size={14} />, TEXTO: <Type size={14} />,
};
const TIPO_ICONE_LG: Record<string, ReactNode> = {
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
   Context Menu
   ═══════════════════════════════════════════════════════════════════════════ */

interface CtxMenuItem {
    label: string;
    icon: ReactNode;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    divider?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: CtxMenuItem[];
    onClose: () => void;
}

function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) onCloseRef.current();
        };
        const handleCtx = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) onCloseRef.current();
        };
        const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
        const handleScroll = () => onCloseRef.current();

        const raf = requestAnimationFrame(() => {
            document.addEventListener("click", handleClick, true);
            document.addEventListener("contextmenu", handleCtx, true);
            document.addEventListener("keydown", handleEsc);
            window.addEventListener("scroll", handleScroll, true);
        });

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("contextmenu", handleCtx, true);
            document.removeEventListener("keydown", handleEsc);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, []);

    const [pos, setPos] = useState({ x, y });
    useEffect(() => {
        if (!menuRef.current) return;
        const rect = menuRef.current.getBoundingClientRect();
        let nx = x, ny = y;
        if (rect.right > window.innerWidth) nx = window.innerWidth - rect.width - 8;
        if (rect.bottom > window.innerHeight) ny = window.innerHeight - rect.height - 8;
        if (nx < 0) nx = 8;
        if (ny < 0) ny = 8;
        setPos({ x: nx, y: ny });
    }, [x, y]);

    return (
        <>
            <div className="fixed inset-0 z-99" onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
            <div
                ref={menuRef}
                className="fixed z-100 bg-white rounded-xl shadow-lg border border-border-light py-1.5 min-w-48 animate-in fade-in zoom-in-95 duration-150 font-lexend"
                style={{ left: pos.x, top: pos.y }}
                onContextMenu={(e) => e.preventDefault()}
            >
                {items.map((item, i) => (
                    <div key={i}>
                        {item.divider && <div className="h-px bg-border-light my-1.5 mx-3" />}
                        <button
                            onClick={() => { item.onClick(); onClose(); }}
                            disabled={item.disabled}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                                item.danger ? "text-brand-red hover:bg-red-50" : "text-text-primary hover:bg-bg-secondary"
                            }`}
                        >
                            <span className="w-4 h-4 flex items-center justify-center shrink-0">{item.icon}</span>
                            {item.label}
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sidebar — Tópicos
   ═══════════════════════════════════════════════════════════════════════════ */

interface TopicosSidebarProps {
    topicos: TopicoGerenciar[];
    topicoSelecionadoId: number | null;
    onSelectTopico: (id: number) => void;
    filtro: string;
    onFiltroChange: (v: string) => void;
    cor: string;
    onContextMenu: (e: React.MouseEvent, topico: TopicoGerenciar) => void;
    onNovoTopico: () => void;
    isOpen: boolean;
    onClose: () => void;
    onConteudoClick?: (conteudoId: number) => void;
}

function TopicosSidebar({
    topicos,
    topicoSelecionadoId,
    onSelectTopico,
    filtro,
    onFiltroChange,
    cor,
    onContextMenu,
    onNovoTopico,
    isOpen,
    onClose,
    onConteudoClick,
}: TopicosSidebarProps) {
    const [expandidos, setExpandidos] = useState<Set<number>>(new Set());

    const toggleExpand = (id: number) => {
        setExpandidos((prev) => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    const topicosFiltrados = useMemo(() => {
        if (!filtro.trim()) return topicos;
        const lower = filtro.toLowerCase();
        return topicos.filter(
            (t) =>
                t.titulo.toLowerCase().includes(lower) ||
                t.conteudos.some((c) => c.titulo.toLowerCase().includes(lower)),
        );
    }, [topicos, filtro]);

    return (
        <aside className={`w-72 bg-white border-r border-border-light flex flex-col overflow-hidden shrink-0 absolute lg:static inset-y-0 left-0 z-40 lg:z-auto transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[11px] text-text-tertiary uppercase tracking-widest font-lexend">
                        Tópicos
                    </h3>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>
                <Input
                    placeholder="Filtrar tópicos..."
                    leftIcon={Search}
                    value={filtro}
                    onChange={(e) => onFiltroChange(e.target.value)}
                    size="sm"
                />
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
                {topicosFiltrados.map((topico) => {
                    const isExpanded = expandidos.has(topico.id);
                    const isSelected = topico.id === topicoSelecionadoId;

                    return (
                        <div key={topico.id}>
                            <button
                                onClick={() => {
                                    onSelectTopico(topico.id);
                                }}
                                onContextMenu={(e) => onContextMenu(e, topico)}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all cursor-pointer group ${
                                    isSelected ? "font-bold" : "text-text-secondary hover:bg-bg-secondary"
                                }`}
                                style={isSelected ? { backgroundColor: hexToRgba(cor, 0.08), color: cor } : undefined}
                            >
                                <span
                                    onClick={(e) => { e.stopPropagation(); toggleExpand(topico.id); }}
                                    className="cursor-pointer p-0.5"
                                >
                                    {isExpanded
                                        ? <ChevronDown size={14} className={isSelected ? "" : "text-text-tertiary"} />
                                        : <ChevronRight size={14} className={isSelected ? "" : "text-text-tertiary"} />
                                    }
                                </span>

                                {isExpanded
                                    ? <FolderOpen size={16} style={isSelected ? { color: cor } : undefined} className={isSelected ? "" : "text-text-tertiary"} />
                                    : <Folder size={16} className="text-text-tertiary" />
                                }

                                <span className="text-sm truncate flex-1 text-left">
                                    {topico.ordem}. {topico.titulo}
                                </span>

                                <span className="text-[10px] text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    {topico.totalConteudos}
                                </span>
                            </button>

                            {/* Conteúdos do tópico expandidos */}
                            {isExpanded && (
                                <div className="ml-6.5 pl-3 border-l-2 border-border-light/60 space-y-0.5 py-1">
                                    {topico.conteudos.length > 0 ? (
                                        topico.conteudos.map((conteudo) => (
                                            <div
                                                key={conteudo.id}
                                                onClick={() => onConteudoClick?.(conteudo.id)}
                                                className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-secondary hover:text-text-primary cursor-pointer transition-colors"
                                            >
                                                <span className={`flex items-center justify-center shrink-0 ${TIPO_COR[conteudo.tipo] || ""}`}>
                                                    {TIPO_ICONE_SM[conteudo.tipo] || <FileText size={14} />}
                                                </span>
                                                <span className="truncate">{conteudo.titulo}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-[11px] text-text-tertiary italic px-2 py-1.5">
                                            Sem conteúdos
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {topicosFiltrados.length === 0 && (
                    <p className="text-xs text-text-tertiary text-center py-6 italic">
                        Nenhum tópico encontrado.
                    </p>
                )}
            </div>

            {/* Botão de adicionar tópico */}
            <div className="p-3 border-t border-border-light">
                <button
                    onClick={onNovoTopico}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                >
                    <Plus size={16} />
                    Novo Tópico
                </button>
            </div>
        </aside>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Card de Conteúdo
   ═══════════════════════════════════════════════════════════════════════════ */

interface ConteudoCardProps {
    conteudo: ConteudoResumo;
    cor: string;
    onEdit: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

function ConteudoCard({
    conteudo,
    cor,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}: ConteudoCardProps) {
    const tipoCor = TIPO_COR[conteudo.tipo] || "text-gray-500 bg-gray-50";

    return (
        <div className="bg-white rounded-xl border border-border-light p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all font-lexend group cursor-pointer" onClick={onEdit}>
            {/* Drag Handle */}
            <div className="text-text-tertiary hover:text-text-secondary cursor-grab active:cursor-grabbing p-1" onClick={(e) => e.stopPropagation()}>
                <GripVertical size={18} />
            </div>

            {/* Ícone do tipo */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tipoCor}`}>
                {TIPO_ICONE_LG[conteudo.tipo] || <FileText size={20} />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${tipoCor}`}>
                        {TIPO_LABEL[conteudo.tipo] || conteudo.tipo}
                    </span>
                    <span className="text-[10px] text-text-tertiary font-bold">
                        #{conteudo.ordem}
                    </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary truncate">
                    {conteudo.titulo}
                </h3>
            </div>

            {/* Tempo */}
            {conteudo.tempoMin != null && conteudo.tempoMin > 0 && (
                <div className="hidden sm:flex items-center gap-1.5 text-text-tertiary shrink-0">
                    <Clock size={14} />
                    <span className="text-xs font-bold">{conteudo.tempoMin} min</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onMoveUp}
                    disabled={isFirst}
                    title="Mover para cima"
                    className="p-1.5 text-text-tertiary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowUp size={14} />
                </button>
                <button
                    onClick={onMoveDown}
                    disabled={isLast}
                    title="Mover para baixo"
                    className="p-1.5 text-text-tertiary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <ArrowDown size={14} />
                </button>

                <div className="w-px h-4 bg-border-light mx-1" />

                <button
                    onClick={onEdit}
                    title="Editar"
                    className="p-1.5 text-text-tertiary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={onDelete}
                    title="Excluir"
                    className="p-1.5 text-text-tertiary hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Modal de Criar / Editar Tópico
   ═══════════════════════════════════════════════════════════════════════════ */

interface TopicoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { titulo: string; descricao?: string }) => void;
    isLoading?: boolean;
    editData?: { titulo: string; descricao?: string | null } | null;
}

function TopicoFormModal({ isOpen, onClose, onSubmit, isLoading, editData }: TopicoFormModalProps) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [erro, setErro] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitulo(editData?.titulo || "");
            setDescricao(editData?.descricao || "");
            setErro("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, editData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) { setErro("O título é obrigatório."); return; }
        onSubmit({ titulo: titulo.trim(), descricao: descricao.trim() || undefined });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 font-lexend">
                <h2 className="text-lg font-bold text-text-primary mb-1">
                    {editData ? "Editar Tópico" : "Novo Tópico"}
                </h2>
                <p className="text-sm text-text-tertiary mb-5">
                    {editData ? "Altere as informações do tópico." : "Preencha as informações para criar um novo tópico."}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input ref={inputRef} label="Título" placeholder="Ex: Equações de 1º Grau"
                        value={titulo} onChange={(e) => { setTitulo(e.target.value); if (erro) setErro(""); }}
                        error={erro} maxLength={200} size="md" />
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-primary font-medium">
                            Descrição <span className="text-text-tertiary font-normal">(opcional)</span>
                        </label>
                        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Breve descrição do tópico..." maxLength={300} rows={3}
                            className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-base text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20 transition-all duration-200 resize-none" />
                        <span className="text-[11px] text-text-tertiary text-right">{descricao.length}/300</span>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Botao type="button" variant="secondary" size="md" onClick={onClose} disabled={isLoading}
                            className="flex-1 bg-gray-100 text-text-primary! hover:bg-gray-200!">Cancelar</Botao>
                        <Botao type="submit" variant="primary" size="md" isLoading={isLoading} className="flex-1">
                            {editData ? "Salvar" : "Criar Tópico"}
                        </Botao>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Modal de Criar / Editar Conteúdo
   ═══════════════════════════════════════════════════════════════════════════ */

type TipoConteudo = 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXTO';

interface ConteudoFormData {
    titulo: string;
    tipo: TipoConteudo;
    tempoMin?: number;
}

interface ConteudoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ConteudoFormData) => void;
    isLoading?: boolean;
    editData?: { titulo: string; tipo: TipoConteudo; tempoMin?: number | null } | null;
}

function ConteudoFormModal({ isOpen, onClose, onSubmit, isLoading, editData }: ConteudoFormModalProps) {
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState<TipoConteudo>("VIDEO");
    const [tempoMin, setTempoMin] = useState("");
    const [erro, setErro] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTitulo(editData?.titulo || "");
            setTipo(editData?.tipo || "VIDEO");
            setTempoMin(editData?.tempoMin ? String(editData.tempoMin) : "");
            setErro("");
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, editData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim()) { setErro("O título é obrigatório."); return; }
        onSubmit({
            titulo: titulo.trim(),
            tipo,
            tempoMin: tempoMin ? parseInt(tempoMin, 10) : undefined,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 font-lexend">
                <h2 className="text-lg font-bold text-text-primary mb-1">
                    {editData ? "Editar Conteúdo" : "Novo Conteúdo"}
                </h2>
                <p className="text-sm text-text-tertiary mb-5">
                    {editData ? "Altere as informações do conteúdo." : "Preencha as informações para criar um novo conteúdo."}
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input ref={inputRef} label="Título" placeholder="Ex: Introdução a Funções"
                        value={titulo} onChange={(e) => { setTitulo(e.target.value); if (erro) setErro(""); }}
                        error={erro} maxLength={200} size="md" />

                    {/* Tipo selector */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-primary font-medium">Tipo do Conteúdo</label>
                        <div className="grid grid-cols-4 gap-2">
                            {TIPO_CONTEUDO_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setTipo(opt.value)}
                                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                                        tipo === opt.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border-light hover:border-gray-300"
                                    }`}
                                >
                                    <span className={opt.cor}>{opt.icon}</span>
                                    <span className="text-xs font-bold text-text-primary">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tempo */}
                    <Input label="Tempo estimado (min)" placeholder="Ex: 15"
                        value={tempoMin} onChange={(e) => setTempoMin(e.target.value.replace(/\D/g, ''))}
                        numericOnly size="md" helperText="Opcional — tempo estimado em minutos" />

                    <div className="flex gap-3 pt-2">
                        <Botao type="button" variant="secondary" size="md" onClick={onClose} disabled={isLoading}
                            className="flex-1 bg-gray-100 text-text-primary! hover:bg-gray-200!">Cancelar</Botao>
                        <Botao type="submit" variant="primary" size="md" isLoading={isLoading} className="flex-1">
                            {editData ? "Salvar" : "Criar Conteúdo"}
                        </Botao>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Página Principal
   ═══════════════════════════════════════════════════════════════════════════ */

export default function GerenciarMateriaPage() {
    const params = useParams();
    const router = useRouter();
    const materiaId = Number(params.id);

    const {
        data: materia,
        isLoading,
        error,
        criarTopico,
        atualizarTopico,
        deletarTopico,
        reordenarTopicos,
        criarConteudo,
        atualizarConteudo,
        deletarConteudo,
        reordenarConteudos,
    } = useMateriaGerenciar(materiaId);

    const toast = useToast();
    const confirmModal = useModal();

    const [filtroSidebar, setFiltroSidebar] = useState("");
    const [topicoSelecionadoId, setTopicoSelecionadoId] = useState<number | null>(null);

    // Modais Tópico
    const [isTopicoModalOpen, setIsTopicoModalOpen] = useState(false);
    const [editandoTopico, setEditandoTopico] = useState<TopicoGerenciar | null>(null);

    // Modais Conteúdo
    const [isConteudoModalOpen, setIsConteudoModalOpen] = useState(false);
    const [editandoConteudo, setEditandoConteudo] = useState<ConteudoResumo | null>(null);

    // Context menu
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; topico: TopicoGerenciar } | null>(null);

    // Sidebar responsiva
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Drag and drop conteúdos
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

    const cor = materia?.cor || "#00ccf0";

    // Auto-selecionar primeiro tópico
    useEffect(() => {
        if (materia && materia.topicos.length > 0 && topicoSelecionadoId === null) {
            setTopicoSelecionadoId(materia.topicos[0].id);
        }
    }, [materia, topicoSelecionadoId]);

    // Tópico selecionado
    const topicoSelecionado = useMemo(
        () => materia?.topicos.find((t) => t.id === topicoSelecionadoId) ?? null,
        [materia, topicoSelecionadoId],
    );

    // Stats
    const stats = useMemo(() => {
        if (!materia) return { totalTopicos: 0, totalConteudos: 0, totalMin: 0 };
        return materia.topicos.reduce(
            (acc, t) => ({
                totalTopicos: acc.totalTopicos + 1,
                totalConteudos: acc.totalConteudos + t.totalConteudos,
                totalMin: acc.totalMin + (t.duracaoMin || 0),
            }),
            { totalTopicos: 0, totalConteudos: 0, totalMin: 0 },
        );
    }, [materia]);

    // ═══ Handlers Tópico ═══════════════════════════════════════════════════

    const handleCriarTopico = useCallback(() => {
        setEditandoTopico(null);
        setIsTopicoModalOpen(true);
    }, []);

    const handleEditTopico = useCallback((topico: TopicoGerenciar) => {
        setEditandoTopico(topico);
        setIsTopicoModalOpen(true);
    }, []);

    const handleDeleteTopico = useCallback(
        (topico: TopicoGerenciar) => {
            confirmModal.confirm(
                "Excluir tópico?",
                `Tem certeza que deseja excluir "${topico.titulo}"? ${
                    topico.totalConteudos > 0
                        ? "Este tópico possui conteúdos. Remova-os primeiro."
                        : "Esta ação não pode ser desfeita."
                }`,
                () => {
                    deletarTopico.mutate(topico.id, {
                        onError: (err: any) => toast.show(err?.response?.data?.message || "Erro ao excluir.", "error"),
                        onSuccess: () => {
                            toast.show("Tópico excluído!", "success");
                            if (topicoSelecionadoId === topico.id) setTopicoSelecionadoId(null);
                        },
                    });
                },
            );
        },
        [confirmModal, deletarTopico, toast, topicoSelecionadoId],
    );

    const handleTopicoFormSubmit = useCallback(
        (data: { titulo: string; descricao?: string }) => {
            if (editandoTopico) {
                atualizarTopico.mutate(
                    { topicoId: editandoTopico.id, data },
                    {
                        onSuccess: () => { setIsTopicoModalOpen(false); toast.show("Tópico atualizado!", "success"); },
                        onError: (err: any) => toast.show(err?.response?.data?.message || "Erro ao atualizar.", "error"),
                    },
                );
            } else {
                criarTopico.mutate(data, {
                    onSuccess: () => { setIsTopicoModalOpen(false); toast.show("Tópico criado!", "success"); },
                    onError: (err: any) => toast.show(err?.response?.data?.message || "Erro ao criar.", "error"),
                });
            }
        },
        [editandoTopico, criarTopico, atualizarTopico, toast],
    );

    const handleMoveTopico = useCallback(
        (topico: TopicoGerenciar, dir: "up" | "down") => {
            if (!materia) return;
            const ids = materia.topicos.map((t) => t.id);
            const idx = ids.indexOf(topico.id);
            const newIdx = dir === "up" ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= ids.length) return;
            const newIds = [...ids];
            [newIds[idx], newIds[newIdx]] = [newIds[newIdx], newIds[idx]];
            reordenarTopicos.mutate(newIds);
        },
        [materia, reordenarTopicos],
    );

    // ═══ Handlers Conteúdo ════════════════════════════════════════════════

    const handleCriarConteudo = useCallback(() => {
        setEditandoConteudo(null);
        setIsConteudoModalOpen(true);
    }, []);

    const handleEditConteudo = useCallback((c: ConteudoResumo) => {
        router.push(`/admin/materias/${materiaId}/conteudo/${c.id}`);
    }, [router, materiaId]);

    const handleDeleteConteudo = useCallback(
        (c: ConteudoResumo) => {
            confirmModal.confirm(
                "Excluir conteúdo?",
                `Tem certeza que deseja excluir "${c.titulo}"? Esta ação não pode ser desfeita.`,
                () => {
                    deletarConteudo.mutate(c.id, {
                        onError: (err: any) => toast.show(err?.response?.data?.message || "Erro ao excluir.", "error"),
                        onSuccess: () => toast.show("Conteúdo excluído!", "success"),
                    });
                },
            );
        },
        [confirmModal, deletarConteudo, toast],
    );

    const handleConteudoFormSubmit = useCallback(
        (data: ConteudoFormData) => {
            if (!topicoSelecionadoId) return;
            criarConteudo.mutate(
                { topicoId: topicoSelecionadoId, data },
                {
                    onSuccess: (response: any) => {
                        setIsConteudoModalOpen(false);
                        toast.show("Conteúdo criado! Redirecionando...", "success");
                        const novoId = response?.data?.id;
                        if (novoId) {
                            router.push(`/admin/materias/${materiaId}/conteudo/${novoId}`);
                        }
                    },
                    onError: (err: any) => toast.show(err?.response?.data?.message || "Erro ao criar.", "error"),
                },
            );
        },
        [topicoSelecionadoId, criarConteudo, toast, router, materiaId],
    );

    const handleMoveConteudo = useCallback(
        (c: ConteudoResumo, dir: "up" | "down") => {
            if (!topicoSelecionado) return;
            const ids = topicoSelecionado.conteudos.map((x) => x.id);
            const idx = ids.indexOf(c.id);
            const newIdx = dir === "up" ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= ids.length) return;
            const newIds = [...ids];
            [newIds[idx], newIds[newIdx]] = [newIds[newIdx], newIds[idx]];
            reordenarConteudos.mutate({ topicoId: topicoSelecionado.id, conteudoIds: newIds });
        },
        [topicoSelecionado, reordenarConteudos],
    );

    // ═══ Drag & Drop Conteúdos ════════════════════════════════════════════

    const handleDragStart = useCallback((conteudoId: number) => {
        setDraggedId(conteudoId);
        setDragOverIdx(null);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        setDragOverIdx(e.clientY < midY ? idx : idx + 1);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedId(null);
        setDragOverIdx(null);
    }, []);

    const handleDrop = useCallback(() => {
        if (draggedId === null || dragOverIdx === null || !topicoSelecionado) {
            handleDragEnd();
            return;
        }
        const ids = topicoSelecionado.conteudos.map((x) => x.id);
        const fromIdx = ids.indexOf(draggedId);
        if (fromIdx === -1) { handleDragEnd(); return; }
        const newIds = [...ids];
        const [moved] = newIds.splice(fromIdx, 1);
        const adjustedIdx = dragOverIdx > fromIdx ? dragOverIdx - 1 : dragOverIdx;
        newIds.splice(adjustedIdx, 0, moved);
        if (newIds.some((id, i) => id !== ids[i])) {
            reordenarConteudos.mutate({ topicoId: topicoSelecionado.id, conteudoIds: newIds });
        }
        handleDragEnd();
    }, [draggedId, dragOverIdx, topicoSelecionado, reordenarConteudos, handleDragEnd]);

    // ═══ Context Menu (sidebar tópicos) ═══════════════════════════════════

    const handleCtxMenu = useCallback((e: React.MouseEvent, topico: TopicoGerenciar) => {
        e.preventDefault();
        e.stopPropagation();
        setCtxMenu(null);
        requestAnimationFrame(() => setCtxMenu({ x: e.clientX, y: e.clientY, topico }));
    }, []);

    const ctxMenuItems: CtxMenuItem[] = useMemo(() => {
        if (!ctxMenu || !materia) return [];
        const t = ctxMenu.topico;
        const idx = materia.topicos.findIndex((x) => x.id === t.id);
        return [
            { label: "Editar Tópico", icon: <Pencil size={14} />, onClick: () => handleEditTopico(t) },
            { label: "Mover para Cima", icon: <ArrowUp size={14} />, onClick: () => handleMoveTopico(t, "up"), disabled: idx === 0 },
            { label: "Mover para Baixo", icon: <ArrowDown size={14} />, onClick: () => handleMoveTopico(t, "down"), disabled: idx === materia.topicos.length - 1 },
            { label: "Excluir Tópico", icon: <Trash2 size={14} />, onClick: () => handleDeleteTopico(t), danger: true, divider: true },
        ];
    }, [ctxMenu, materia, handleEditTopico, handleMoveTopico, handleDeleteTopico]);

    // ═══ Loading / Error ══════════════════════════════════════════════════

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-row">
                <AdminSidebar />
                <main className="flex flex-1 flex-col overflow-hidden"><LoadingScreen /></main>
            </div>
        );
    }

    if (error || !materia) {
        return (
            <div className="w-full h-screen flex flex-row">
                <AdminSidebar />
                <main className="flex flex-1 items-center justify-center">
                    <div className="text-center font-lexend space-y-4">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                            <BookOpen size={28} className="text-brand-red" />
                        </div>
                        <p className="text-brand-red text-lg font-bold">Matéria não encontrada</p>
                        <Botao variant="primary" size="md" onClick={() => router.push("/admin/materias")}>
                            Voltar para Matérias
                        </Botao>
                    </div>
                </main>
            </div>
        );
    }

    // ═══ Render ═══════════════════════════════════════════════════════════

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />

            <main className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-border-light px-6 flex items-center justify-between shrink-0 font-lexend">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/admin/materias")}
                            className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer" title="Voltar">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => setSidebarOpen((v) => !v)}
                            className="lg:hidden text-text-tertiary hover:text-text-primary transition-colors cursor-pointer" title="Tópicos">
                            <Menu size={20} />
                        </button>
                        <div className="h-6 w-px bg-border-light" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: hexToRgba(cor, 0.1), color: cor }}>
                                {getIconComponent(materia.icone, 18)}
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-text-primary leading-none">{materia.nome}</h2>
                                <p className="text-[10px] text-text-tertiary mt-0.5">Gestão de Tópicos e Conteúdos</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-text-tertiary">
                        <span className="flex items-center gap-1.5">
                            <Layers size={14} style={{ color: cor }} />
                            <span className="text-text-primary">{stats.totalTopicos}</span> tópicos
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen size={14} style={{ color: cor }} />
                            <span className="text-text-primary">{stats.totalConteudos}</span> conteúdos
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} style={{ color: cor }} />
                            <span className="text-text-primary">{stats.totalMin}</span> min
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Mobile sidebar backdrop */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 bg-black/30 z-30 lg:hidden animate-in fade-in duration-200"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar: Tópicos */}
                    <TopicosSidebar
                        topicos={materia.topicos}
                        topicoSelecionadoId={topicoSelecionadoId}
                        onSelectTopico={(id) => { setTopicoSelecionadoId(id); setSidebarOpen(false); }}
                        filtro={filtroSidebar}
                        onFiltroChange={setFiltroSidebar}
                        cor={cor}
                        onContextMenu={handleCtxMenu}
                        onNovoTopico={handleCriarTopico}
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                        onConteudoClick={(conteudoId) => router.push(`/admin/materias/${materiaId}/conteudo/${conteudoId}`)}
                    />

                    {/* Área principal: Conteúdos do tópico selecionado */}
                    <div className="flex-1 bg-bg-secondary overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-8 pb-24">
                            {topicoSelecionado ? (
                                <>
                                    {/* Header do tópico */}
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-black text-text-tertiary uppercase tracking-wider">
                                                    Tópico {topicoSelecionado.ordem}
                                                </span>
                                                <button onClick={() => handleEditTopico(topicoSelecionado)}
                                                    className="p-1 text-text-tertiary hover:text-primary transition-colors cursor-pointer" title="Editar tópico">
                                                    <Pencil size={14} />
                                                </button>
                                            </div>
                                            <h2 className="text-2xl font-bold text-text-primary font-lexend truncate">
                                                {topicoSelecionado.titulo}
                                            </h2>
                                            {topicoSelecionado.descricao && (
                                                <p className="text-sm text-text-secondary mt-1 font-lexend">
                                                    {topicoSelecionado.descricao}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 mt-3 text-xs font-bold text-text-tertiary">
                                                <span>{topicoSelecionado.totalAulas} aulas</span>
                                                <span className="w-1 h-1 rounded-full bg-border-light" />
                                                <span>{topicoSelecionado.totalQuiz} quiz</span>
                                                <span className="w-1 h-1 rounded-full bg-border-light" />
                                                <span>{topicoSelecionado.duracaoMin || 0} min</span>
                                            </div>
                                        </div>
                                        <Botao variant="primary" size="md" leftIcon={Plus} onClick={handleCriarConteudo}>
                                            Novo Conteúdo
                                        </Botao>
                                    </div>

                                    {/* Lista de conteúdos */}
                                    <div
                                        className="space-y-3"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                    >
                                        {topicoSelecionado.conteudos.map((c, idx) => (
                                            <div key={c.id}>
                                                {/* Drop indicator */}
                                                {draggedId !== null && dragOverIdx === idx && draggedId !== c.id && (
                                                    <div className="h-1 bg-primary rounded-full mx-4 mb-3 animate-in fade-in duration-150" />
                                                )}
                                                <div
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.effectAllowed = 'move';
                                                        handleDragStart(c.id);
                                                    }}
                                                    onDragOver={(e) => handleDragOver(e, idx)}
                                                    onDragEnd={handleDragEnd}
                                                    className={`transition-all duration-200 ${draggedId === c.id ? 'opacity-30 scale-[0.98]' : ''}`}
                                                >
                                                    <ConteudoCard
                                                        conteudo={c}
                                                        cor={cor}
                                                        onEdit={() => handleEditConteudo(c)}
                                                        onDelete={() => handleDeleteConteudo(c)}
                                                        onMoveUp={() => handleMoveConteudo(c, "up")}
                                                        onMoveDown={() => handleMoveConteudo(c, "down")}
                                                        isFirst={idx === 0}
                                                        isLast={idx === topicoSelecionado.conteudos.length - 1}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Drop indicator at end */}
                                        {draggedId !== null && dragOverIdx === topicoSelecionado.conteudos.length && (
                                            <div className="h-1 bg-primary rounded-full mx-4 animate-in fade-in duration-150" />
                                        )}

                                        {/* Empty state */}
                                        {topicoSelecionado.conteudos.length === 0 && (
                                            <div className="text-center py-16 font-lexend">
                                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                                    style={{ backgroundColor: hexToRgba(cor, 0.08) }}>
                                                    <FileText size={28} style={{ color: cor }} />
                                                </div>
                                                <h3 className="text-lg font-bold text-text-primary mb-1">
                                                    Nenhum conteúdo
                                                </h3>
                                                <p className="text-sm text-text-secondary mb-5 max-w-xs mx-auto">
                                                    Adicione vídeos, PDFs, textos ou quizzes a este tópico.
                                                </p>
                                                <Botao variant="primary" size="md" leftIcon={Plus} onClick={handleCriarConteudo}>
                                                    Criar Primeiro Conteúdo
                                                </Botao>
                                            </div>
                                        )}

                                        {/* Quick add */}
                                        {topicoSelecionado.conteudos.length > 0 && (
                                            <button onClick={handleCriarConteudo}
                                                className="w-full border-2 border-dashed border-border-light rounded-xl p-3 flex items-center justify-center gap-2 text-text-tertiary hover:text-primary hover:border-primary/40 hover:bg-white transition-all cursor-pointer group font-lexend">
                                                <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
                                                <span className="font-bold text-sm">Adicionar Conteúdo</span>
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Nenhum tópico selecionado */
                                <div className="flex flex-col items-center justify-center h-full min-h-96 font-lexend">
                                    {materia.topicos.length === 0 ? (
                                        <>
                                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                                                style={{ backgroundColor: hexToRgba(cor, 0.08) }}>
                                                <Layers size={36} style={{ color: cor }} />
                                            </div>
                                            <h3 className="text-xl font-bold text-text-primary mb-2">
                                                Nenhum tópico ainda
                                            </h3>
                                            <p className="text-sm text-text-secondary mb-6 max-w-sm text-center">
                                                Comece criando tópicos para organizar o conteúdo de {materia.nome}.
                                            </p>
                                            <Botao variant="primary" size="md" leftIcon={Plus} onClick={handleCriarTopico}>
                                                Criar Primeiro Tópico
                                            </Botao>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-bg-secondary">
                                                <ChevronRight size={32} className="text-text-tertiary" />
                                            </div>
                                            <h3 className="text-lg font-bold text-text-primary mb-1">
                                                Selecione um tópico
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                Escolha um tópico na sidebar para ver seus conteúdos.
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Modais */}
            <TopicoFormModal
                isOpen={isTopicoModalOpen}
                onClose={() => setIsTopicoModalOpen(false)}
                onSubmit={handleTopicoFormSubmit}
                isLoading={criarTopico.isPending || atualizarTopico.isPending}
                editData={editandoTopico}
            />

            <ConteudoFormModal
                isOpen={isConteudoModalOpen}
                onClose={() => setIsConteudoModalOpen(false)}
                onSubmit={handleConteudoFormSubmit}
                isLoading={criarConteudo.isPending || atualizarConteudo.isPending}
                editData={editandoConteudo}
            />

            <Modal isOpen={confirmModal.isOpen} onClose={confirmModal.close} {...confirmModal.options} />

            {/* Context Menu */}
            {ctxMenu && (
                <ContextMenu x={ctxMenu.x} y={ctxMenu.y} items={ctxMenuItems} onClose={() => setCtxMenu(null)} />
            )}

            {/* Toast */}
            {toast.toast && (
                <div onClick={toast.dismiss}
                    className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-lexend text-sm flex items-center gap-3 cursor-pointer animate-in slide-in-from-bottom-4 duration-300 ${
                        toast.toast.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-700"
                            : "bg-red-50 border border-red-200 text-red-700"
                    }`}>
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
