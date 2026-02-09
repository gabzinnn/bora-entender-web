'use client';
import Logo from "@/app/components/Logo";
import { GraduationCap, Shield } from "lucide-react";
import Link from "next/link";

export default function MainAdm() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
            <div className="max-w-4xl w-full">
                <Logo size="xxl" variant="completo" className="mb-12 mx-auto" />
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo, Admin!</h1>
                    <p className="text-gray-600">Escolha como deseja acessar o sistema</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Card Área do Aluno */}
                    <Link
                        href="/aluno"
                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-blue-400 flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                            <GraduationCap className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Área do Aluno</h2>
                        <p className="text-gray-600 text-center">
                            Acesse como aluno para visualizar conteúdos, materiais e acompanhar seu progresso
                        </p>
                    </Link>

                    {/* Card Área Administrativa */}
                    <Link
                        href="/admin/home"
                        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-8 border-2 border-transparent hover:border-purple-400 flex flex-col items-center gap-4 cursor-pointer"
                    >
                        <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                            <Shield className="w-10 h-10 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Área Administrativa</h2>
                        <p className="text-gray-600 text-center">
                            Gerencie usuários, conteúdos, planos e visualize relatórios do sistema
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    )
}