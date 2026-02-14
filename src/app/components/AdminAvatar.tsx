'use client';

import { useState } from "react";
import { User, LogOut, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

interface AdminAvatarProps {
    userName?: string;
    userRole?: string;
    userAvatarUrl?: string;
    userInitials?: string;
}

export default function AdminAvatar({ 
    userName = "Admin User",
    userRole = "Administrador",
    userAvatarUrl,
    userInitials = "AU",
}: AdminAvatarProps) {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useAuth();

    const handleGoToAluno = () => {
        router.push('/aluno');
        setMenuOpen(false);
    };

    return (
        <div className="relative flex items-center gap-3">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold leading-none text-[#111718]">
                    {userName}
                </p>
                <p className="text-[10px] text-text-tertiary mt-1 uppercase tracking-wider">
                    {userRole}
                </p>
            </div>
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`
                    w-10 h-10 rounded-full border-2 border-white shadow-sm
                    flex items-center justify-center shrink-0 cursor-pointer
                    hover:border-primary transition-all
                    ${userAvatarUrl
                        ? "bg-cover bg-center"
                        : "bg-primary/20"
                    }
                `}
                style={userAvatarUrl ? { backgroundImage: `url('${userAvatarUrl}')` } : undefined}
            >
                {!userAvatarUrl && (
                    <span className="text-sm font-bold text-primary">
                        {userInitials}
                    </span>
                )}
            </button>

            {/* Menu Dropdown */}
            {menuOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <button
                        onClick={handleGoToAluno}
                        className="w-full flex items-center gap-3 px-4 py-3 text-text-main hover:bg-gray-50 transition-colors rounded-t-xl font-medium text-sm cursor-pointer"
                    >
                        <GraduationCap size={18} />
                        Modo Aluno
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-b-xl font-medium text-sm cursor-pointer"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            )}

            {/* Backdrop transparente para fechar o menu ao clicar fora */}
            {menuOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </div>
    );
}
