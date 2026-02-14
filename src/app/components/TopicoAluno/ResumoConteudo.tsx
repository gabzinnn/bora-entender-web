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
                    <article 
                        className="prose prose-sm prose-gray max-w-none
                            prose-headings:text-gray-900 
                            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-gray-900
                            prose-ul:my-4 prose-li:my-1
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-img:rounded-lg prose-img:shadow-md
                        "
                        style={{
                            '--tw-prose-links': cor,
                            '--tw-prose-bullets': cor,
                            '--tw-prose-quote-borders': cor
                        } as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: resumoHtml }}
                    />
                </div>
            </div>
        </div>
    );
}
