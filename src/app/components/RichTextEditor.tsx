'use client';

import {
    useState,
    useRef,
    useCallback,
    useEffect,
    type CSSProperties,
} from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Unlink,
    RemoveFormatting,
    Palette,
    Highlighter,
    Quote,
    Code,
    Minus,
    Undo,
    Redo,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    label?: string;
    helperText?: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Inline Style Definitions (portable HTML output)
   ═══════════════════════════════════════════════════════════════════════════ */

const INLINE_STYLES: Record<string, Record<string, string>> = {
    BLOCKQUOTE: {
        borderLeft: '4px solid #0cc3e4',
        padding: '8px 16px',
        fontStyle: 'italic',
        color: '#6b7280',
        margin: '12px 0',
        backgroundColor: '#f9fafb',
        borderRadius: '0 8px 8px 0',
    },
    H1: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#1f2937',
    },
    H2: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#1f2937',
    },
    H3: {
        fontSize: '1.125rem',
        fontWeight: '700',
        marginBottom: '8px',
        color: '#1f2937',
    },
    PRE: {
        backgroundColor: '#111827',
        color: '#4ade80',
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        margin: '12px 0',
        overflowX: 'auto',
    },
    UL: {
        listStyleType: 'disc',
        marginLeft: '24px',
        marginBottom: '8px',
    },
    OL: {
        listStyleType: 'decimal',
        marginLeft: '24px',
        marginBottom: '8px',
    },
    LI: {
        marginBottom: '4px',
    },
    HR: {
        borderColor: '#e5e7eb',
        margin: '16px 0',
    },
};

/** Convert a camelCase style object to a CSS string */
function stylesToCssText(styles: Record<string, string>): string {
    return Object.entries(styles)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
        .join('; ');
}

/**
 * Process raw editor HTML to embed inline styles on known block elements.
 * User-applied inline styles (foreColor, hiliteColor) on other elements are preserved.
 */
function processHtmlForOutput(html: string): string {
    if (!html || typeof window === 'undefined') return html;
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        for (const [tag, styles] of Object.entries(INLINE_STYLES)) {
            doc.body.querySelectorAll(tag).forEach(el => {
                const htmlEl = el as HTMLElement;
                // Preserve user-applied styles (like foreColor) by merging
                const existing = htmlEl.style.cssText || '';
                const base = stylesToCssText(styles);
                // Build merged: our base styles + any existing user styles not in our base
                htmlEl.setAttribute('style', base + (existing ? '; ' + existing : ''));
            });
        }

        // Links: preserve href, add styling
        doc.body.querySelectorAll('a').forEach(el => {
            const htmlEl = el as HTMLElement;
            htmlEl.style.color = '#0cc3e4';
            htmlEl.style.textDecoration = 'underline';
        });

        return doc.body.innerHTML;
    } catch {
        return html;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   Color Presets
   ═══════════════════════════════════════════════════════════════════════════ */

const TEXT_COLORS = [
    '#101718', '#6b7280', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const HIGHLIGHT_COLORS = [
    'transparent', '#fef3c7', '#fce7f3', '#dbeafe',
    '#dcfce7', '#f3e8ff', '#ffedd5', '#e0f2fe',
    '#fef9c3', '#ede9fe',
];

/* ═══════════════════════════════════════════════════════════════════════════
   Toolbar Button
   ═══════════════════════════════════════════════════════════════════════════ */

interface ToolbarBtnProps {
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
}

function ToolbarBtn({ icon, title, onClick, active, disabled }: ToolbarBtnProps) {
    return (
        <button
            type="button"
            title={title}
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            disabled={disabled}
            className={`p-1.5 rounded-md transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
            }`}
        >
            {icon}
        </button>
    );
}

function ToolbarSep() {
    return <div className="w-px h-6 bg-border-light mx-0.5 shrink-0" />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Color Picker Dropdown
   ═══════════════════════════════════════════════════════════════════════════ */

interface ColorDropdownProps {
    colors: string[];
    onSelect: (color: string) => void;
    onClose: () => void;
    title: string;
}

function ColorDropdown({ colors, onSelect, onClose, title }: ColorDropdownProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-border-light p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1.5 px-1">
                {title}
            </p>
            <div className="grid grid-cols-5 gap-1">
                {colors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => { onSelect(color); onClose(); }}
                        className="w-7 h-7 rounded-md border border-border-light hover:scale-110 transition-transform cursor-pointer"
                        style={{
                            backgroundColor: color === 'transparent' ? '#fff' : color,
                            backgroundImage: color === 'transparent'
                                ? 'linear-gradient(135deg, #fff 45%, #ef4444 50%, #fff 55%)'
                                : undefined,
                        }}
                        title={color === 'transparent' ? 'Sem cor' : color}
                    />
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Rich Text Editor
   ═══════════════════════════════════════════════════════════════════════════ */

export default function RichTextEditor({
    value,
    onChange,
    placeholder = 'Comece a escrever...',
    minHeight = 200,
    maxHeight = 600,
    label,
    helperText,
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [showTextColor, setShowTextColor] = useState(false);
    const [showHighlight, setShowHighlight] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isEmpty, setIsEmpty] = useState(!value || value === '<br>' || value === '<p><br></p>');
    const savedSelectionRef = useRef<Range | null>(null);
    /** Tracks the last HTML we emitted via onChange so we can skip feedback loops */
    const lastEmittedRef = useRef<string>('');

    // ─── Sync external value into the editor ─────────────────────────────────
    useEffect(() => {
        if (!editorRef.current) return;
        // Only overwrite when the value truly changed externally (not from our own onChange)
        if (value !== lastEmittedRef.current) {
            editorRef.current.innerHTML = value || '';
            lastEmittedRef.current = value || '';
            setIsEmpty(!value || value === '<br>' || value === '<p><br></p>');
        }
    }, [value]);

    const saveSelection = useCallback(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
        }
    }, []);

    const restoreSelection = useCallback(() => {
        if (savedSelectionRef.current) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelectionRef.current);
            }
        }
    }, []);

    const exec = useCallback((command: string, value?: string) => {
        restoreSelection();
        document.execCommand(command, false, value);
        if (editorRef.current) {
            const processed = processHtmlForOutput(editorRef.current.innerHTML);
            lastEmittedRef.current = processed;
            onChange(processed);
            setIsEmpty(
                !editorRef.current.textContent?.trim() &&
                !editorRef.current.querySelector('img'),
            );
        }
        saveSelection();
    }, [onChange, restoreSelection, saveSelection]);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            const processed = processHtmlForOutput(editorRef.current.innerHTML);
            lastEmittedRef.current = processed;
            onChange(processed);
            setIsEmpty(
                !editorRef.current.textContent?.trim() &&
                !editorRef.current.querySelector('img'),
            );
        }
    }, [onChange]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'b': e.preventDefault(); exec('bold'); break;
                    case 'i': e.preventDefault(); exec('italic'); break;
                    case 'u': e.preventDefault(); exec('underline'); break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) exec('redo');
                        else exec('undo');
                        break;
                }
                return;
            }

            // Enter inside blockquote/pre: always exit the block and continue as normal paragraph
            if (e.key === 'Enter' && !e.shiftKey) {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0) {
                    let node: Node | null = sel.anchorNode;
                    let blockEl: HTMLElement | null = null;

                    while (node && node !== editorRef.current) {
                        if (node instanceof HTMLElement && (node.tagName === 'BLOCKQUOTE' || node.tagName === 'PRE')) {
                            blockEl = node;
                            break;
                        }
                        node = node.parentNode;
                    }

                    if (blockEl) {
                        e.preventDefault();
                        // Insert a paragraph after the block element
                        const p = document.createElement('p');
                        p.innerHTML = '<br>';
                        blockEl.insertAdjacentElement('afterend', p);
                        // Move caret into the new paragraph
                        const range = document.createRange();
                        range.setStart(p, 0);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        handleInput();
                        return;
                    }
                }
            }
        },
        [exec, handleInput],
    );

    const handlePaste = useCallback(
        (e: React.ClipboardEvent) => {
            // Força colar como texto simples para sanitizar
            e.preventDefault();
            const html = e.clipboardData.getData('text/html');
            const text = e.clipboardData.getData('text/plain');

            if (html) {
                // Remove estilos inline perigosos mas mantém formatação
                const clean = html
                    .replace(/class="[^"]*"/gi, '')
                    .replace(/style="[^"]*"/gi, '')
                    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
                document.execCommand('insertHTML', false, clean);
            } else {
                document.execCommand('insertText', false, text);
            }
            handleInput();
        },
        [handleInput],
    );

    const insertLink = useCallback(() => {
        restoreSelection();
        const url = prompt('Cole a URL do link:');
        if (url) {
            exec('createLink', url);
        }
    }, [exec, restoreSelection]);

    const removeLink = useCallback(() => {
        exec('unlink');
    }, [exec]);

    /** Toggle a block format: if the cursor is already inside the same block type, revert to <p> */
    const toggleFormatBlock = useCallback(
        (tag: string) => {
            restoreSelection();
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                let node: Node | null = sel.anchorNode;
                const tagName = tag.replace(/[<>]/g, '').toUpperCase();
                while (node && node !== editorRef.current) {
                    if (node instanceof HTMLElement && node.tagName === tagName) {
                        // Already inside this block — revert to normal paragraph
                        exec('formatBlock', '<p>');
                        return;
                    }
                    node = node.parentNode;
                }
            }
            exec('formatBlock', tag);
        },
        [exec, restoreSelection],
    );

    const insertHR = useCallback(() => {
        exec('insertHorizontalRule');
    }, [exec]);

    const editorStyle: CSSProperties = {
        minHeight,
        maxHeight,
        overflowY: 'auto',
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm text-text-primary font-medium font-lexend">
                    {label}
                </label>
            )}

            <div
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    isFocused
                        ? 'border-primary ring-4 ring-primary/20'
                        : 'border-border-light'
                }`}
            >
                {/* ─── Toolbar ─────────────────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border-light bg-bg-secondary/50">
                    {/* Undo / Redo */}
                    <ToolbarBtn icon={<Undo size={16} />} title="Desfazer (Ctrl+Z)" onClick={() => exec('undo')} />
                    <ToolbarBtn icon={<Redo size={16} />} title="Refazer (Ctrl+Shift+Z)" onClick={() => exec('redo')} />

                    <ToolbarSep />

                    {/* Formatação básica */}
                    <ToolbarBtn icon={<Bold size={16} />} title="Negrito (Ctrl+B)" onClick={() => exec('bold')} />
                    <ToolbarBtn icon={<Italic size={16} />} title="Itálico (Ctrl+I)" onClick={() => exec('italic')} />
                    <ToolbarBtn icon={<Underline size={16} />} title="Sublinhado (Ctrl+U)" onClick={() => exec('underline')} />
                    <ToolbarBtn icon={<Strikethrough size={16} />} title="Tachado" onClick={() => exec('strikeThrough')} />

                    <ToolbarSep />

                    {/* Cores */}
                    <div className="relative">
                        <ToolbarBtn
                            icon={<Palette size={16} />}
                            title="Cor do texto"
                            onClick={() => { saveSelection(); setShowTextColor((v) => !v); setShowHighlight(false); }}
                        />
                        {showTextColor && (
                            <ColorDropdown
                                colors={TEXT_COLORS}
                                title="Cor do texto"
                                onSelect={(c) => exec('foreColor', c)}
                                onClose={() => setShowTextColor(false)}
                            />
                        )}
                    </div>
                    <div className="relative">
                        <ToolbarBtn
                            icon={<Highlighter size={16} />}
                            title="Cor de destaque"
                            onClick={() => { saveSelection(); setShowHighlight((v) => !v); setShowTextColor(false); }}
                        />
                        {showHighlight && (
                            <ColorDropdown
                                colors={HIGHLIGHT_COLORS}
                                title="Destaque"
                                onSelect={(c) => exec('hiliteColor', c === 'transparent' ? 'transparent' : c)}
                                onClose={() => setShowHighlight(false)}
                            />
                        )}
                    </div>

                    <ToolbarSep />

                    {/* Headings */}
                    <ToolbarBtn icon={<Heading1 size={16} />} title="Título 1" onClick={() => toggleFormatBlock('<h1>')} />
                    <ToolbarBtn icon={<Heading2 size={16} />} title="Título 2" onClick={() => toggleFormatBlock('<h2>')} />
                    <ToolbarBtn icon={<Heading3 size={16} />} title="Título 3" onClick={() => toggleFormatBlock('<h3>')} />

                    <ToolbarSep />

                    {/* Listas */}
                    <ToolbarBtn icon={<List size={16} />} title="Lista com marcadores" onClick={() => exec('insertUnorderedList')} />
                    <ToolbarBtn icon={<ListOrdered size={16} />} title="Lista numerada" onClick={() => exec('insertOrderedList')} />

                    <ToolbarSep />

                    {/* Alinhamento */}
                    <ToolbarBtn icon={<AlignLeft size={16} />} title="Alinhar à esquerda" onClick={() => exec('justifyLeft')} />
                    <ToolbarBtn icon={<AlignCenter size={16} />} title="Centralizar" onClick={() => exec('justifyCenter')} />
                    <ToolbarBtn icon={<AlignRight size={16} />} title="Alinhar à direita" onClick={() => exec('justifyRight')} />

                    <ToolbarSep />

                    {/* Extras */}
                    <ToolbarBtn icon={<Quote size={16} />} title="Citação" onClick={() => toggleFormatBlock('<blockquote>')} />
                    <ToolbarBtn icon={<Code size={16} />} title="Código" onClick={() => toggleFormatBlock('<pre>')} />
                    <ToolbarBtn icon={<Minus size={16} />} title="Linha horizontal" onClick={insertHR} />

                    <ToolbarSep />

                    {/* Links */}
                    <ToolbarBtn icon={<LinkIcon size={16} />} title="Inserir link" onClick={insertLink} />
                    <ToolbarBtn icon={<Unlink size={16} />} title="Remover link" onClick={removeLink} />

                    <ToolbarSep />

                    {/* Limpar formatação */}
                    <ToolbarBtn
                        icon={<RemoveFormatting size={16} />}
                        title="Limpar formatação"
                        onClick={() => exec('removeFormat')}
                    />
                </div>

                {/* ─── Editor ──────────────────────────────────────────── */}
                <div className="relative">
                    {isEmpty && !isFocused && (
                        <div
                            className="absolute top-0 left-0 right-0 px-5 py-4 text-text-secondary/60 pointer-events-none text-base font-lexend"
                            style={{ minHeight }}
                        >
                            {placeholder}
                        </div>
                    )}

                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onFocus={() => { setIsFocused(true); }}
                        onBlur={() => { setIsFocused(false); saveSelection(); }}
                        onMouseUp={saveSelection}
                        onKeyUp={saveSelection}
                        className="px-5 py-4 text-base text-text-primary font-lexend focus:outline-none prose prose-sm max-w-none
                            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:text-text-primary
                            [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-2 [&_h2]:text-text-primary
                            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:text-text-primary
                            [&_p]:mb-2
                            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-2
                            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-2
                            [&_li]:mb-1
                            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-3
                            [&_pre]:bg-gray-900 [&_pre]:text-green-400 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm [&_pre]:my-3 [&_pre]:overflow-x-auto
                            [&_a]:text-primary [&_a]:underline
                            [&_hr]:border-border-light [&_hr]:my-4"
                        style={editorStyle}
                    />
                </div>
            </div>

            {helperText && (
                <p className="text-xs text-text-tertiary font-lexend">{helperText}</p>
            )}
        </div>
    );
}
