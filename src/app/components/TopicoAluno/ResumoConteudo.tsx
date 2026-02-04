'use client';
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ResumoConteudoProps {
    resumoHtml: string;
    cor?: string;
    inicialmenteAberto?: boolean;
}

export default function ResumoConteudo({
    resumoHtml,
    cor = '#0cc3e4',
    inicialmenteAberto = true
}: ResumoConteudoProps) {
    const [isOpen, setIsOpen] = useState(inicialmenteAberto);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header clicável */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ 
                            backgroundColor: `${cor}15`,
                            color: cor
                        }}
                    >
                        <BookOpen size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-900">Resumo do Conteúdo</h3>
                        <p className="text-sm text-gray-500">
                            {isOpen ? 'Clique para ocultar' : 'Clique para expandir'}
                        </p>
                    </div>
                </div>
                
                <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                    style={{ 
                        backgroundColor: isOpen ? `${cor}15` : '#f3f4f6',
                        color: isOpen ? cor : '#9ca3af'
                    }}
                >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
            </button>

            {/* Conteúdo do resumo com animação */}
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                {/* Linha decorativa */}
                <div 
                    className="h-0.5 w-full"
                    style={{
                        background: `linear-gradient(90deg, ${cor} 0%, ${cor}30 100%)`
                    }}
                />
                
                {/* Conteúdo */}
                <div className="px-6 py-5 bg-linear-to-b from-gray-50/50 to-white">
                    <div 
                        className="prose prose-sm max-w-none
                            prose-headings:text-gray-900 
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-strong:text-gray-900
                            prose-ul:my-2 prose-li:my-1 prose-li:text-gray-700
                            prose-a:no-underline hover:prose-a:underline"
                        style={{
                            '--tw-prose-links': cor,
                            '--tw-prose-bullets': cor
                        } as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: resumoHtml }}
                    />
                </div>
            </div>
        </div>
    );
}
