import React from "react";
import * as LucideIcons from "lucide-react";

interface CardMateriaProps {
    cor: string;
    icone: string; // Nome do ícone como string
    titulo: string;
    descricao: string;
    progresso: number;
    status: "em-dia" | "atrasado" | "novo";
    labelStatus: string;
    botaoText: string;
    onClick?: () => void;
    iniciado?: boolean;
}

export default function CardMateria({
    cor,
    icone,
    titulo,
    descricao,
    progresso,
    status,
    labelStatus,
    botaoText,
    onClick,
    iniciado = true,
}: CardMateriaProps) {
    const statusConfig = {
        "em-dia": "bg-gray-100 text-gray-500",
        "atrasado": "bg-red-50 text-red-500",
        "novo": "text-blue-500",
    };

    const statusBg = statusConfig[status] || statusConfig["em-dia"];

    // Renderiza o ícone do Lucide
    const IconComponent = (LucideIcons as any)[icone];
    const renderedIcon = IconComponent ? <IconComponent size={24} /> : null;

    return (
        <article className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 group h-full">
            <div className="h-2 w-full" style={{ backgroundColor: cor }}></div>
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div
                        className="size-14 rounded-xl flex items-center justify-center"
                        style={{
                            backgroundColor: `${cor}15`,
                            color: cor,
                        }}
                    >
                        {renderedIcon}
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${statusBg}`}>
                        {labelStatus}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-text-main mb-1">
                    {titulo}
                </h3>
                <p className="text-sm text-text-secondary mb-6 line-clamp-2">
                    {descricao}
                </p>

                <div className="mt-auto">
                    {iniciado ? (
                        <>
                            <div className="flex justify-between text-xs font-bold mb-2">
                                <span className="text-text-secondary">PROGRESSO</span>
                                <span style={{ color: cor }}>{progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                                <div
                                    className="h-2.5 rounded-full transition-all"
                                    style={{
                                        width: `${progresso}%`,
                                        backgroundColor: cor,
                                    }}
                                ></div>
                            </div>
                            <button
                                onClick={onClick}
                                className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                                style={{
                                    backgroundColor: cor,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.filter = "brightness(0.9)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.filter = "brightness(1)";
                                }}
                            >
                                {botaoText}
                            </button>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-text-secondary mb-6 font-medium">
                                Ainda não iniciado
                            </p>
                            <button
                                onClick={onClick}
                                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all border-2 cursor-pointer"
                                style={{
                                    borderColor: cor,
                                    color: cor,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = cor;
                                    e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = cor;
                                }}
                            >
                                {botaoText}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </article>
    );
}