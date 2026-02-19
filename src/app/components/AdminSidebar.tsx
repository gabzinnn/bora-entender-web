'use client';
import { LayoutDashboard, LogOut, NotebookText, Menu, X, ChevronLeft, ChevronRight, Users, Wallet, CreditCard } from "lucide-react";
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
    isCollapsed?: boolean;
}

function Item({ title, icon, path, isActive, onClick, isCollapsed }: ItemProps) {
    return (
        <Link href={path} onClick={onClick} className={`w-full flex flex-row items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-colors ${
            isActive ? 'bg-[#00cdef]/10 text-[#00cdef]' : 'text-gray-500 hover:bg-gray-100'
        } ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="text-current font-bold shrink-0">{icon}</div>
            {!isCollapsed && <span className="text-sm font-bold truncate">{title}</span>}
        </Link>
    )
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { signOut } = useAuth();

    const tabs = [
        { title: 'Home', icon: <LayoutDashboard size={20} />, path: '/admin/home' },
        { title: 'Financeiro', icon: <Wallet size={20} />, path: '/admin/financeiro' },
        { title: 'Matérias', icon: <NotebookText size={20} />, path: '/admin/materias' },
        { title: 'Alunos', icon: <Users size={20} />, path: '/admin/alunos' },
        { title: 'Planos', icon: <CreditCard size={20} />, path: '/admin/planos' },
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
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
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
            <aside className={`hidden md:flex relative h-screen border-r border-gray-200/80 flex-col bg-white transition-all duration-300 overflow-hidden ${
                isCollapsed ? 'w-20 p-4 items-center' : 'w-56 p-5 items-stretch'
            }`}>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`absolute top-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 z-10 cursor-pointer ${
                        isCollapsed ? 'right-1.5' : 'right-4'
                    }`}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>

                <div className={`flex justify-center transition-all duration-300 ${isCollapsed ? 'mt-12' : 'mt-0'}`}>
                    <Image
                        src={isCollapsed ? "/assets/images/logoMenor.png" : "/assets/images/logoCompleto.png"}
                        alt="Bora Entender Logo"
                        width={isCollapsed ? 40 : 130}
                        height={isCollapsed ? 40 : 130}
                        className="transition-all duration-300"
                    />
                </div>
                <nav className="w-full flex flex-col gap-2 mt-8 py-2 flex-1">
                    {tabs.map((tab) => (
                        <Item 
                            key={tab.title} 
                            title={tab.title} 
                            icon={tab.icon} 
                            path={tab.path}
                            isActive={pathname === tab.path}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                    <button 
                        onClick={signOut} 
                        className={`w-full mt-auto flex flex-row items-center px-3 py-2.5 gap-3 cursor-pointer rounded-xl text-gray-500 hover:bg-gray-100 transition-colors hover:text-red-500 ${
                            isCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                    >
                        <LogOut size={20} className="shrink-0" />
                        {!isCollapsed && <span className="text-sm font-bold">Sair</span>}
                    </button>
                </nav>
            </aside>

            {/* Sidebar Mobile */}
            <aside className={`md:hidden fixed left-0 top-0 w-64 h-screen p-6 flex flex-col items-center bg-white shadow-2xl z-40 transition-transform duration-300 ${
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