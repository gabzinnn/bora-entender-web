import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface EquationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (latex: string) => void;
}

const TABS = [
    { id: 'basic', label: 'Básico' },
    { id: 'greek', label: 'Grego' },
    { id: 'operators', label: 'Operadores' },
    { id: 'relations', label: 'Relações' },
];

const SYMBOLS: Record<string, { latex: string; label?: string }[]> = {
    basic: [
        { latex: '\\frac{a}{b}', label: 'Fração' },
        { latex: '\\sqrt{x}', label: 'Raiz' },
        { latex: 'x^2', label: 'Potência' },
        { latex: 'x_i', label: 'Índice' },
        { latex: '(', label: '(' },
        { latex: ')', label: ')' },
        { latex: '[', label: '[' },
        { latex: ']', label: ']' },
        { latex: '\\{', label: '{' },
        { latex: '\\}', label: '}' },
    ],
    greek: [
        { latex: '\\alpha' }, { latex: '\\beta' }, { latex: '\\gamma' }, { latex: '\\delta' },
        { latex: '\\epsilon' }, { latex: '\\zeta' }, { latex: '\\eta' }, { latex: '\\theta' },
        { latex: '\\pi' }, { latex: '\\sigma' }, { latex: '\\tau' }, { latex: '\\phi' },
        { latex: '\\chi' }, { latex: '\\psi' }, { latex: '\\omega' },
        { latex: '\\Delta' }, { latex: '\\Sigma' }, { latex: '\\Omega' }, { latex: '\\Phi' },
    ],
    operators: [
        { latex: '+' }, { latex: '-' }, { latex: '\\times' }, { latex: '\\div' },
        { latex: '\\pm' }, { latex: '\\cdot' },
        { latex: '\\sum_{i=1}^{n}' }, { latex: '\\prod' }, { latex: '\\int' },
        { latex: '\\lim_{x \\to 0}' }, { latex: '\\infty' },
        { latex: '\\partial' }, { latex: '\\nabla' },
    ],
    relations: [
        { latex: '=' }, { latex: '\\neq' }, { latex: '<' }, { latex: '>' },
        { latex: '\\leq' }, { latex: '\\geq' }, { latex: '\\approx' }, { latex: '\\equiv' },
        { latex: '\\in' }, { latex: '\\notin' }, { latex: '\\subset' }, { latex: '\\supset' },
        { latex: '\\rightarrow' }, { latex: '\\Rightarrow' }, { latex: '\\leftrightarrow' },
    ],
};

export default function EquationModal({ isOpen, onClose, onInsert }: EquationModalProps) {
    const [latex, setLatex] = useState('');
    const [activeTab, setActiveTab] = useState('basic');
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLatex('');
        }
    }, [isOpen]);

    useEffect(() => {
        if (previewRef.current && isOpen) {
            try {
                katex.render(latex || '\\text{Pré-visualização...}', previewRef.current, {
                    throwOnError: false,
                    displayMode: true,
                });
            } catch (e) {
                // Ignore parsing errors while typing
            }
        }
    }, [latex, isOpen]);

    const handleInsert = () => {
        if (!latex.trim()) return;

        try {
            // Render to HTML string
            const html = katex.renderToString(latex, {
                throwOnError: false,
                displayMode: false
            });

            // Wrap in span with contentEditable=false and data attribute
            const wrappedHtml = `<span contenteditable="false" class="math-equation" data-latex="${latex.replace(/"/g, '&quot;')}">${html}</span>`;

            onInsert(wrappedHtml);
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    const addSymbol = (symbol: string) => {
        setLatex((prev) => prev + symbol + ' ');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-200" style={{ maxHeight: '90vh' }}>

                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-800">Inserir Equação Matemática</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-500 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 min-h-[100px] flex items-center justify-center overflow-x-auto">
                        <div ref={previewRef} className="text-xl text-gray-800" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600 block">Código LaTeX</label>
                        <textarea
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none font-mono text-sm transition-all"
                            placeholder="\sum_{i=1}^{n} i^2"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-t-md transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                            ? 'text-primary border-b-2 border-primary bg-primary/5'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100 max-h-[200px] overflow-y-auto">
                            {SYMBOLS[activeTab]?.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => addSymbol(item.latex)}
                                    className="aspect-square flex flex-col items-center justify-center p-1 bg-white hover:bg-primary/5 border border-gray-200 hover:border-primary/20 rounded-md transition-all shadow-sm hover:shadow active:scale-95 group"
                                    title={item.label || item.latex}
                                >
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: katex.renderToString(item.latex, { throwOnError: false })
                                        }}
                                        className="text-lg group-hover:text-primary"
                                    />
                                    {item.label && <span className="text-[9px] text-gray-400 mt-0.5 truncate w-full text-center">{item.label}</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!latex.trim()}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                    >
                        <Check size={16} />
                        Inserir Equação
                    </button>
                </div>
            </div>
        </div>
    );
}
