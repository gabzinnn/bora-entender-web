'use client';

import { X, BookOpen, Calculator, Microscope, Atom, Globe, Palette, Music, Code, Heart, Lightbulb, Leaf, Scale, History, Languages, Dumbbell, FlaskConical, Brain, PenTool, BarChart3, Check, Pipette } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useState, useCallback, useRef, useEffect, type FormEvent, type MouseEvent as ReactMouseEvent, type TouchEvent as ReactTouchEvent } from 'react';
import { Input } from '../Input';
import { Botao } from '../Botao';

interface CriarMateriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CriarMateriaData) => void;
    isLoading?: boolean;
}

export interface CriarMateriaData {
    nome: string;
    descricao?: string;
    cor: string;
    icone: string;
}

// Presets rápidos de cor
const COR_PRESETS = [
    '#00ccf0', '#13ec13', '#ff4d2e', '#ffd500',
    '#8b5cf6', '#f97316', '#ec4899', '#14b8a6',
    '#6366f1', '#84cc16',
];

// ─── Helpers de conversão HSV <-> RGB <-> HEX ──────────────────────────────

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; }
    else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; }
    else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; }
    else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === r) h = 60 * (((g - b) / d) % 6);
        else if (max === g) h = 60 * ((b - r) / d + 2);
        else h = 60 * ((r - g) / d + 4);
    }
    if (h < 0) h += 360;
    const s = max === 0 ? 0 : d / max;
    return [h, s, max];
}

function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): [number, number, number] | null {
    const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return null;
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

// ─── ColorPicker Component ─────────────────────────────────────────────────

interface ColorPickerProps {
    value: string;
    onChange: (hex: string) => void;
}

function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [hsv, setHsv] = useState<[number, number, number]>(() => {
        const rgb = hexToRgb(value);
        return rgb ? rgbToHsv(...rgb) : [195, 1, 0.94];
    });
    const [hexInput, setHexInput] = useState(value);
    const [isDraggingSV, setIsDraggingSV] = useState(false);
    const [isDraggingHue, setIsDraggingHue] = useState(false);

    const svCanvasRef = useRef<HTMLCanvasElement>(null);
    const hueCanvasRef = useRef<HTMLCanvasElement>(null);
    const svContainerRef = useRef<HTMLDivElement>(null);
    const hueContainerRef = useRef<HTMLDivElement>(null);

    // Sync external value changes
    useEffect(() => {
        const rgb = hexToRgb(value);
        if (rgb) {
            const newHsv = rgbToHsv(...rgb);
            setHsv(newHsv);
            setHexInput(value);
        }
    }, [value]);

    // Draw SV square
    useEffect(() => {
        const canvas = svCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width, h = canvas.height;

        // Base hue color
        const [r, g, b] = hsvToRgb(hsv[0], 1, 1);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(0, 0, w, h);

        // White gradient (left to right)
        const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0, 0, w, h);

        // Black gradient (top to bottom)
        const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
        ctx.fillStyle = blackGrad;
        ctx.fillRect(0, 0, w, h);
    }, [hsv[0]]);

    // Draw Hue bar
    useEffect(() => {
        const canvas = hueCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        for (let i = 0; i <= 360; i += 30) {
            const [r, g, b] = hsvToRgb(i, 1, 1);
            grad.addColorStop(i / 360, `rgb(${r},${g},${b})`);
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, canvas.height);
    }, []);

    const updateFromHsv = useCallback((newHsv: [number, number, number]) => {
        setHsv(newHsv);
        const [r, g, b] = hsvToRgb(...newHsv);
        const hex = rgbToHex(r, g, b);
        setHexInput(hex);
        onChange(hex);
    }, [onChange]);

    // SV picking
    const pickSV = useCallback((clientX: number, clientY: number) => {
        const container = svContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
        updateFromHsv([hsv[0], s, v]);
    }, [hsv, updateFromHsv]);

    // Hue picking
    const pickHue = useCallback((clientX: number) => {
        const container = hueContainerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
        updateFromHsv([h, hsv[1], hsv[2]]);
    }, [hsv, updateFromHsv]);

    // Mouse/Touch handlers for SV
    const handleSVDown = useCallback((e: ReactMouseEvent | ReactTouchEvent) => {
        e.preventDefault();
        setIsDraggingSV(true);
        const pos = 'touches' in e ? e.touches[0] : e;
        pickSV(pos.clientX, pos.clientY);
    }, [pickSV]);

    useEffect(() => {
        if (!isDraggingSV) return;
        const handleMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
            e.preventDefault();
            const pos = 'touches' in e ? e.touches[0] : e;
            pickSV(pos.clientX, pos.clientY);
        };
        const handleUp = () => setIsDraggingSV(false);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDraggingSV, pickSV]);

    // Mouse/Touch handlers for Hue
    const handleHueDown = useCallback((e: ReactMouseEvent | ReactTouchEvent) => {
        e.preventDefault();
        setIsDraggingHue(true);
        const pos = 'touches' in e ? e.touches[0] : e;
        pickHue(pos.clientX);
    }, [pickHue]);

    useEffect(() => {
        if (!isDraggingHue) return;
        const handleMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
            e.preventDefault();
            const pos = 'touches' in e ? e.touches[0] : e;
            pickHue(pos.clientX);
        };
        const handleUp = () => setIsDraggingHue(false);
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleUp);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDraggingHue, pickHue]);

    // Hex input handler
    const handleHexChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        setHexInput(val);
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
            const rgb = hexToRgb(val);
            if (rgb) {
                const newHsv = rgbToHsv(...rgb);
                setHsv(newHsv);
                onChange(val.toLowerCase());
            }
        }
    }, [onChange]);

    // Cursor positions
    const svCursorLeft = `${hsv[1] * 100}%`;
    const svCursorTop = `${(1 - hsv[2]) * 100}%`;
    const hueCursorLeft = `${(hsv[0] / 360) * 100}%`;

    return (
        <div className="flex flex-col gap-3">
            {/* SV Square */}
            <div
                ref={svContainerRef}
                className="relative w-full aspect-2/1 rounded-lg overflow-hidden cursor-crosshair select-none"
                onMouseDown={handleSVDown}
                onTouchStart={handleSVDown}
            >
                <canvas
                    ref={svCanvasRef}
                    width={300}
                    height={150}
                    className="w-full h-full block"
                />
                {/* Cursor */}
                <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: svCursorLeft,
                        top: svCursorTop,
                        backgroundColor: value,
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                />
            </div>

            {/* Hue Bar */}
            <div
                ref={hueContainerRef}
                className="relative w-full h-3.5 rounded-full overflow-hidden cursor-pointer select-none"
                onMouseDown={handleHueDown}
                onTouchStart={handleHueDown}
            >
                <canvas
                    ref={hueCanvasRef}
                    width={300}
                    height={14}
                    className="w-full h-full block rounded-full"
                />
                {/* Hue cursor */}
                <div
                    className="absolute top-1/2 w-4.5 h-4.5 rounded-full border-2 border-white shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: hueCursorLeft,
                        backgroundColor: rgbToHex(...hsvToRgb(hsv[0], 1, 1)),
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)',
                    }}
                />
            </div>

            {/* Hex input + preview + presets */}
            <div className="flex items-center gap-2">
                <div
                    className="w-9 h-9 rounded-lg border border-border-light shrink-0"
                    style={{ backgroundColor: value }}
                />
                <div className="relative flex-1 max-w-28">
                    <input
                        type="text"
                        value={hexInput}
                        onChange={handleHexChange}
                        maxLength={7}
                        className="w-full h-9 px-3 text-sm font-mono rounded-lg border border-border-light bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary uppercase"
                        spellCheck={false}
                    />
                </div>
                <div className="flex gap-1 flex-wrap flex-1 justify-end">
                    {COR_PRESETS.map((preset) => (
                        <button
                            key={preset}
                            type="button"
                            onClick={() => onChange(preset)}
                            className={`
                                w-6 h-6 rounded-full transition-all duration-100 cursor-pointer
                                hover:scale-125
                                ${value === preset ? 'ring-2 ring-offset-1 scale-110' : ''}
                            `}
                            style={{ backgroundColor: preset, ['--tw-ring-color' as string]: preset }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// Ícones disponíveis (nome Lucide -> componente)
const ICONES_DISPONIVEIS = [
    { nome: 'BookOpen', label: 'Livro' },
    { nome: 'Calculator', label: 'Calculadora' },
    { nome: 'Microscope', label: 'Microscópio' },
    { nome: 'Atom', label: 'Átomo' },
    { nome: 'Globe', label: 'Globo' },
    { nome: 'Palette', label: 'Paleta' },
    { nome: 'Music', label: 'Música' },
    { nome: 'Code', label: 'Código' },
    { nome: 'Heart', label: 'Coração' },
    { nome: 'Lightbulb', label: 'Lâmpada' },
    { nome: 'Leaf', label: 'Folha' },
    { nome: 'Scale', label: 'Balança' },
    { nome: 'History', label: 'História' },
    { nome: 'Languages', label: 'Idiomas' },
    { nome: 'Dumbbell', label: 'Haltere' },
    { nome: 'FlaskConical', label: 'Frasco' },
    { nome: 'Brain', label: 'Cérebro' },
    { nome: 'PenTool', label: 'Caneta' },
    { nome: 'BarChart3', label: 'Gráfico' },
];

function getIconComponent(iconName: string, size = 20): React.ReactNode {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={size} /> : <BookOpen size={size} />;
}

export function CriarMateriaModal({ isOpen, onClose, onSubmit, isLoading = false }: CriarMateriaModalProps) {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [cor, setCor] = useState(COR_PRESETS[0]);
    const [icone, setIcone] = useState(ICONES_DISPONIVEIS[0].nome);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const backdropRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus no input ao abrir
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Reset ao fechar
    useEffect(() => {
        if (!isOpen) {
            setNome('');
            setDescricao('');
            setCor(COR_PRESETS[0]);
            setIcone(ICONES_DISPONIVEIS[0].nome);
            setErrors({});
        }
    }, [isOpen]);

    // Escape para fechar
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Bloqueia scroll do body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const validate = useCallback(() => {
        const newErrors: Record<string, string> = {};
        if (!nome.trim()) newErrors.nome = 'O nome é obrigatório.';
        else if (nome.trim().length > 100) newErrors.nome = 'Máximo de 100 caracteres.';
        if (descricao && descricao.length > 500) newErrors.descricao = 'Máximo de 500 caracteres.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [nome, descricao]);

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            nome: nome.trim(),
            descricao: descricao.trim() || undefined,
            cor,
            icone,
        });
    }, [nome, descricao, cor, icone, validate, onSubmit]);

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    }, [onClose]);

    // Preview da cor para o hex
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    if (!isOpen) return null;

    return (
        <div
            ref={backdropRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="criar-materia-title"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 sm:p-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 font-lexend max-h-[90vh] overflow-y-auto">
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    aria-label="Fechar"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: hexToRgba(cor, 0.1),
                            color: cor,
                        }}
                    >
                        {getIconComponent(icone, 24)}
                    </div>
                    <div>
                        <h2 id="criar-materia-title" className="text-xl font-bold text-text-primary">
                            Nova Matéria
                        </h2>
                        <p className="text-sm text-text-secondary">
                            Preencha as informações da nova disciplina.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nome */}
                    <Input
                        ref={inputRef}
                        label="Nome da matéria"
                        placeholder="Ex: Matemática, Física, Biologia..."
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        error={errors.nome}
                        maxLength={100}
                        size="md"
                    />

                    {/* Descrição */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-primary font-medium">
                            Descrição <span className="text-text-tertiary font-normal">(opcional)</span>
                        </label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Breve descrição da matéria..."
                            maxLength={500}
                            rows={3}
                            className={`
                                w-full rounded-lg border bg-white px-4 py-3 text-base
                                text-text-primary placeholder:text-text-secondary/60
                                focus:outline-none focus:ring-4 focus:border-primary focus:ring-primary/20
                                transition-all duration-200 resize-none
                                ${errors.descricao ? 'border-brand-red focus:border-brand-red focus:ring-brand-red/20' : 'border-border-light'}
                            `}
                        />
                        <div className="flex justify-between">
                            {errors.descricao && (
                                <p className="text-sm text-brand-red">{errors.descricao}</p>
                            )}
                            <p className="text-xs text-text-tertiary ml-auto">
                                {descricao.length}/500
                            </p>
                        </div>
                    </div>

                    {/* Cor */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-primary font-medium">Cor da matéria</label>
                        <ColorPicker value={cor} onChange={setCor} />
                    </div>

                    {/* Ícone */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-text-primary font-medium">Ícone</label>
                        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
                            {ICONES_DISPONIVEIS.map((ic) => (
                                <button
                                    key={ic.nome}
                                    type="button"
                                    onClick={() => setIcone(ic.nome)}
                                    title={ic.label}
                                    className={`
                                        w-10 h-10 rounded-lg flex items-center justify-center
                                        transition-all duration-150 cursor-pointer
                                        ${icone === ic.nome
                                            ? 'text-white shadow-md scale-105'
                                            : 'text-text-secondary bg-bg-secondary hover:bg-gray-200'
                                        }
                                    `}
                                    style={icone === ic.nome ? {
                                        backgroundColor: cor,
                                    } : undefined}
                                >
                                    {getIconComponent(ic.nome)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="border border-border-light rounded-xl p-4 flex items-center gap-4"
                        style={{ backgroundColor: hexToRgba(cor, 0.03) }}
                    >
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                                backgroundColor: hexToRgba(cor, 0.12),
                                color: cor,
                            }}
                        >
                            {getIconComponent(icone, 28)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-text-primary truncate">
                                {nome || 'Nome da matéria'}
                            </h4>
                            <p className="text-xs text-text-tertiary line-clamp-1 mt-0.5">
                                {descricao || 'Sem descrição'}
                            </p>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                        <Botao
                            type="button"
                            variant="secondary"
                            size="md"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 bg-gray-100 text-text-primary hover:bg-gray-200"
                        >
                            Cancelar
                        </Botao>
                        <Botao
                            type="submit"
                            variant="primary"
                            size="md"
                            isLoading={isLoading}
                            className="flex-1"
                        >
                            Criar Matéria
                        </Botao>
                    </div>
                </form>
            </div>
        </div>
    );
}
