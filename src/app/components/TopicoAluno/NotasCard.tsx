'use client';
import { ChevronDown, FileEdit } from "lucide-react";
import { useState } from "react";

interface NotasCardProps {
    notas?: string;
    onSave?: (notas: string) => void;
}

export default function NotasCard({ notas = '', onSave }: NotasCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [texto, setTexto] = useState(notas);

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left group hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <FileEdit className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                    <span className="font-bold text-gray-700 group-hover:text-primary transition-colors">
                        Minhas Anotações
                    </span>
                </div>
                <ChevronDown 
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    size={20} 
                />
            </button>
            
            {isOpen && (
                <div className="p-4 border-t border-gray-100">
                    <textarea
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Digite suas anotações sobre este conteúdo..."
                        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={() => onSave?.(texto)}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Salvar anotação
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}