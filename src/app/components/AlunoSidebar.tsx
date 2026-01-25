'use client';
import { LayoutDashboard, LogOut, NotebookText, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/authContext";
import { useState } from "react";

interface ItemProps {
    title: string;
    icon: React.ReactNode;
    path: string;
    isActive?: boolean;
    onClick?: () => void;
}

function Item({ title, icon, path, isActive, onClick }: ItemProps) {
    return (
        <Link href={path} onClick={onClick} className={`w-full flex flex-row items-center gap-4 py-2 px-4 rounded-xl cursor-pointer transition-colors ${
            isActive ? 'bg-[#00cdef]/10 text-[#00cdef]' : 'text-gray-500 hover:bg-gray-100'
        }`}>
            <div className="text-current font-bold">{icon}</div>
            <span className={`text-lg font-bold`}>{title}</span>
        </Link>
    )
}

export default function AlunoSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { signOut } = useAuth();

    const tabs = [
        { title: 'Home', icon: <LayoutDashboard size={20} />, path: '/aluno' },
        { title: 'Materias', icon: <NotebookText size={20} />, path: '/aluno/materias' },
    ]

    const handleCloseSidebar = () => setIsOpen(false);

    const handleSignOut = () => {
        handleCloseSidebar();
        signOut();
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-border-light"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={handleCloseSidebar}
                />
            )}

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex md:w-[15vw] h-screen border border-border-light p-8 flex-col items-center bg-white shadow-lg">
                <Image
                    src="/assets/images/logoCompleto.png"
                    alt="Bora Entender Logo"
                    width={150}
                    height={150}
                    className="mb-6"
                />
                <nav className="w-full flex flex-col gap-4 mt-8 py-2 flex-1">
                    {tabs.map((tab) => (
                        <Item 
                            key={tab.title} 
                            title={tab.title} 
                            icon={tab.icon} 
                            path={tab.path}
                            isActive={pathname === tab.path} 
                        />
                    ))}
                    <button onClick={signOut} className="w-full mt-auto flex flex-row justify-start items-center px-4 py-2 gap-4 cursor-pointer rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors hover:text-brand-red-hover">
                        <LogOut size={20} />
                        <span className="text-lg font-bold">Sair</span>
                    </button>
                </nav>
            </aside>

            {/* Sidebar Mobile */}
            <aside className={`md:hidden fixed left-0 top-0 w-64 h-screen border-r border-border-light p-6 flex flex-col items-center bg-white shadow-lg z-40 transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <Image
                    src="/assets/images/logoCompleto.png"
                    alt="Bora Entender Logo"
                    width={120}
                    height={120}
                    className="mb-6 mt-12"
                />
                <nav className="w-full flex flex-col gap-4 mt-8 py-2 flex-1">
                    {tabs.map((tab) => (
                        <Item 
                            key={tab.title} 
                            title={tab.title} 
                            icon={tab.icon} 
                            path={tab.path}
                            isActive={pathname === tab.path}
                            onClick={handleCloseSidebar}
                        />
                    ))}
                    <button onClick={handleSignOut} className="w-full mt-auto flex flex-row justify-start items-center px-4 py-2 gap-4 cursor-pointer rounded-2xl text-gray-500 hover:bg-gray-100 transition-colors hover:text-brand-red-hover">
                        <LogOut size={20} />
                        <span className="text-lg font-bold">Sair</span>
                    </button>
                </nav>
            </aside>
        </>
    )
}