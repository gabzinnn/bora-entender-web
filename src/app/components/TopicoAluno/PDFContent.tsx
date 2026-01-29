interface PDFContentProps {
    titulo: string;
    modulo: string;
    capitulo: string;
    conteudoHtml?: string;
    imagemUrl?: string;
    imagemLegenda?: string;
    paginaAtual?: number;
    totalPaginas?: number;
    cor?: string;
}

export default function PDFContent({
    titulo,
    modulo,
    capitulo,
    conteudoHtml,
    imagemUrl,
    imagemLegenda,
    paginaAtual = 1,
    totalPaginas = 5,
    cor = '#0cc3e4'
}: PDFContentProps) {
    return (
        <div className="w-full max-w-3xl bg-white text-gray-800 shadow-md min-h-175 p-6 sm:p-12 rounded-sm relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{titulo}</h1>
                <p className="text-gray-500 text-sm font-medium">{modulo} • {capitulo}</p>
            </div>

            {/* Content */}
            {conteudoHtml ? (
                <div 
                    className="space-y-6 text-gray-700 leading-relaxed text-justify prose prose-sm sm:prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: conteudoHtml }}
                />
            ) : (
                <div className="space-y-6 text-gray-700 leading-relaxed text-justify">
                    <p>
                        A história antiga é o período que abrange desde a invenção da escrita (c. 4000 a.C.) 
                        até a queda do Império Romano do Ocidente (476 d.C.). Este é um momento crucial na 
                        trajetória humana, marcado pelo surgimento das primeiras civilizações.
                    </p>

                    {imagemUrl && (
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden my-6 relative">
                            <img 
                                src={imagemUrl} 
                                alt={imagemLegenda || 'Imagem do conteúdo'} 
                                className="w-full h-full object-cover opacity-80"
                            />
                            {imagemLegenda && (
                                <div className="absolute bottom-0 w-full bg-black/50 text-white text-xs p-2 text-center">
                                    {imagemLegenda}
                                </div>
                            )}
                        </div>
                    )}

                    <h3 
                        className="text-xl font-bold mt-8 mb-4"
                        style={{ color: cor }}
                    >
                        1. O Surgimento da Escrita
                    </h3>
                    
                    <p>
                        A escrita cuneiforme, desenvolvida pelos sumérios na Mesopotâmia, foi uma das primeiras 
                        formas de registro. Inicialmente utilizada para contabilidade, ela evoluiu para registrar 
                        leis, histórias e crenças religiosas.
                    </p>

                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    {/* Dica de Estudo */}
                    <div 
                        className="p-4 rounded-r-lg mt-6 border-l-4"
                        style={{ 
                            backgroundColor: `${cor}08`,
                            borderLeftColor: cor 
                        }}
                    >
                        <h4 
                            className="font-bold text-sm mb-1 flex items-center gap-2"
                            style={{ color: cor }}
                        >
                            💡 Dica de Estudo
                        </h4>
                        <p className="text-sm">
                            Preste atenção nas datas e nas localizações geográficas dos rios Tigre e Eufrates.
                        </p>
                    </div>
                </div>
            )}

            {/* Page Number */}
            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 text-xs text-gray-400 font-mono">
                Página {paginaAtual} de {totalPaginas}
            </div>
        </div>
    );
}