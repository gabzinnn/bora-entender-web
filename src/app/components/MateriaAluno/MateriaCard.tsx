import * as LucideIcons from "lucide-react";

interface MateriaCardInfoProps {
    nome: string;
    nivel: string;
    totalModulos: number;
    icone: string;
    cor: string;
}

export default function MateriaCardInfo({
    nome,
    nivel,
    totalModulos,
    icone,
    cor
}: MateriaCardInfoProps) {
    // Renderiza o ícone do Lucide
    const IconComponent = (LucideIcons as any)[icone];
    const renderedIcon = IconComponent ? <IconComponent size={36} color="white" /> : null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center text-center">
            <div 
                className="size-16 sm:size-20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg"
                style={{ backgroundColor: cor }}
            >
                {renderedIcon}
            </div>
            <h2 className="font-bold text-xl sm:text-2xl text-gray-900 mb-1">{nome}</h2>
            <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">{nivel}</p>
            <div className="w-full flex flex-col gap-2 sm:gap-3">
                <div className="flex items-center justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-500">Módulos</span>
                    <span className="font-semibold" style={{ color: cor }}>{totalModulos} Total</span>
                </div>
            </div>
        </div>
    );
}