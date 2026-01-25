import { Bot } from "lucide-react";
import Link from "next/link";

interface AjudaCardProps {
    materiaId?: string;
}

export default function AjudaCard({ materiaId }: AjudaCardProps) {
    return (
        <div className="bg-linear-to-br from-yellow-300 to-yellow-500 rounded-2xl p-5 text-gray-900 shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:-translate-y-1">
            <Bot className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 opacity-20 text-gray-900" />
            <div className="relative z-10">
                <h4 className="font-bold text-lg mb-1">Ficou com dúvida?</h4>
                <p className="text-sm font-medium opacity-90 mb-4 leading-snug">Pergunte para nossa IA que te ajuda a entender a matéria.</p>
                <Link 
                    href={materiaId ? `/aluno/assistente?materia=${materiaId}` : '/aluno/assistente'}
                    className="inline-block bg-white hover:bg-gray-50 text-gray-900 text-xs font-bold py-2.5 px-5 rounded-full shadow-sm transition-all cursor-pointer"
                >
                    Perguntar para IA
                </Link>
            </div>
        </div>
    );
}