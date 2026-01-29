interface TextoContentProps {
    titulo: string;
    modulo: string;
    conteudoHtml: string;
    tempoLeitura?: number; // em minutos
    cor?: string;
}

export default function TextoContent({
    titulo,
    modulo,
    conteudoHtml,
    tempoLeitura,
    cor = '#0cc3e4'
}: TextoContentProps) {
    return (
        <div className="w-full max-w-3xl bg-white text-gray-800 shadow-md min-h-125 p-6 sm:p-12 rounded-lg relative">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                    <span 
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ 
                            backgroundColor: `${cor}15`,
                            color: cor 
                        }}
                    >
                        {modulo}
                    </span>
                    {tempoLeitura && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            📖 {tempoLeitura} min de leitura
                        </span>
                    )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{titulo}</h1>
            </div>

            {/* Content */}
            <article 
                className="prose prose-sm sm:prose prose-gray max-w-none
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
                    '--tw-prose-quote-borders': cor 
                } as React.CSSProperties}
                dangerouslySetInnerHTML={{ __html: conteudoHtml }}
            />
        </div>
    );
}