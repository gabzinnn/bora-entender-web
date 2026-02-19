'use client';
import Image from "next/image";
import { useState } from "react";
import { User, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { useHomeAluno } from "@/hooks/useHomeAluno";

interface AvatarAlunoProps {
    variant?: 'compact' | 'expanded';
    imageUrl?: string;
}

export default function AvatarAluno({ 
    variant = 'compact', 
    imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBcy7aghZwyfwjdAAHbk4-swTAFXCjlNHzD4_xCwQsxNeDmEz70cZQ4d3Elbi2RTMlqPi7NSiDnzqQAsi20Y7_luaZhFXoOMKzEd5XJh_kNWP1cHPko5WUe5buokaaEkXVMG_XCYV6kreky8HcrRnFIdMOWRyutMnEMXIfrD6k-2_rXPraOSp9-IExAsS_qQoKVZbcqoNsmctVcrj_12LJ3w3HCaG8mkVj1ENz4qH1OHtfcv9lKKPgpov5jWOg6LAobfQIua5PGyusU" 
}: AvatarAlunoProps) {
    const { data } = useHomeAluno();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut, user } = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    const handleViewProfile = () => {
        router.push('/aluno/perfil');
        setMenuOpen(false);
    };

    const handleGoToAdmin = () => {
        router.push('/admin/home');
        setMenuOpen(false);
    };

    if (variant === 'compact') {
        return (
            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="size-10 rounded-full overflow-hidden hover:opacity-80 transition-opacity cursor-pointer border-2 border-transparent hover:border-primary"
                >
                    <Image
                        src={imageUrl}
                        alt="Avatar do Aluno"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                    />
                </button>

                {/* Menu Dropdown */}
                {menuOpen && (
                    <>
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                            <button
                                onClick={handleViewProfile}
                                className="w-full flex items-center gap-3 px-4 py-3 text-text-main hover:bg-gray-50 transition-colors rounded-t-xl font-medium text-sm cursor-pointer"
                            >
                                <User size={18} />
                                Ver Perfil
                            </button>
                            {isAdmin && (
                                <>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleGoToAdmin}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors font-medium text-sm cursor-pointer"
                                    >
                                        <ShieldCheck size={18} />
                                        Modo Admin
                                    </button>
                                </>
                            )}
                            <div className="border-t border-gray-100"></div>
                            <button
                                onClick={signOut}
                                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-b-xl font-medium text-sm cursor-pointer"
                            >
                                <LogOut size={18} />
                                Sair
                            </button>
                        </div>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setMenuOpen(false)}
                        />
                    </>
                )}
            </div>
        );
    }

    // Variant: expanded
    return (
        <div className="relative">
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-row items-center justify-between border-border-light border rounded-full px-6 py-2 shadow-md bg-white hover:shadow-lg transition-shadow cursor-pointer w-full md:w-auto"
            >
                <div className="flex flex-col w-full">
                    <span className="text-md font-semibold text-text-primary ml-auto">{data?.aluno.nome}</span>
                    <span className="text-sm font-medium text-text-tertiary ml-auto">{data?.aluno.anoEscolar}º ano</span>
                </div>
                <Image
                    src={imageUrl}
                    alt="Avatar do Aluno"
                    width={40}
                    height={40}
                    className="ml-4 rounded-full"
                />
            </button>

            {/* Menu Dropdown */}
            {menuOpen && (
                <>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                        <button
                            onClick={handleViewProfile}
                            className="w-full flex items-center gap-3 px-4 py-3 text-text-main hover:bg-gray-50 transition-colors rounded-t-xl font-medium text-sm cursor-pointer"
                        >
                            <User size={18} />
                            Ver Perfil
                        </button>
                        {isAdmin && (
                            <>
                                <div className="border-t border-gray-100"></div>
                                <button
                                    onClick={handleGoToAdmin}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-primary hover:bg-primary/5 transition-colors font-medium text-sm cursor-pointer"
                                >
                                    <ShieldCheck size={18} />
                                    Modo Admin
                                </button>
                            </>
                        )}
                        <div className="border-t border-gray-100"></div>
                        <button
                            onClick={signOut}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-b-xl font-medium text-sm cursor-pointer"
                        >
                            <LogOut size={18} />
                            Sair
                        </button>
                    </div>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setMenuOpen(false)}
                    />
                </>
            )}
        </div>
    );
}