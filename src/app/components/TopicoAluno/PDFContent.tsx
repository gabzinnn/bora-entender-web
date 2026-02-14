'use client';
import { Download, ExternalLink } from 'lucide-react';

interface PDFContentProps {
    titulo: string;
    modulo: string;
    pdfUrl: string;
    cor?: string;
}

export default function PDFContent({
    titulo,
    modulo,
    pdfUrl,
    cor = '#0cc3e4'
}: PDFContentProps) {
    const viewerUrl = `${pdfUrl}#toolbar=1&navpanes=0&view=FitH`;

    return (
        <div className="w-full bg-white text-gray-800 shadow-md rounded-lg overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span 
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{ 
                                backgroundColor: `${cor}15`,
                                color: cor 
                            }}
                        >
                            {modulo}
                        </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{titulo}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Abrir em nova aba"
                    >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Abrir</span>
                    </a>
                    <a
                        href={pdfUrl}
                        download
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white rounded-lg transition-colors"
                        style={{ backgroundColor: cor }}
                        title="Baixar PDF"
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">Baixar</span>
                    </a>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="w-full flex-1" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
                <iframe
                    src={viewerUrl}
                    className="w-full h-full border-0"
                    title={titulo}
                    allow="autoplay"
                />
            </div>
        </div>
    );
}