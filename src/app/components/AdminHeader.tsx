'use client';

import { Input } from "@/app/components/Input";
import { Botao } from "@/app/components/Botao";
import { Search, type LucideIcon } from "lucide-react";
import React from "react";

// ─── Tipos de Breadcrumb ────────────────────────────────────────
interface BreadcrumbItem {
    label: string;
    href?: string;
}

// ─── Props do Componente ────────────────────────────────────────
interface AdminHeaderProps {
    /** Título exibido na header (variante com título) */
    title?: string;
    /** Subtítulo/descrição abaixo do título */
    subtitle?: string;
    /** Breadcrumbs acima do título */
    breadcrumbs?: BreadcrumbItem[];

    /** Exibir campo de busca */
    showSearch?: boolean;
    /** Placeholder do campo de busca */
    searchPlaceholder?: string;
    /** Valor controlado da busca */
    searchValue?: string;
    /** Callback ao digitar na busca */
    onSearchChange?: (value: string) => void;

    /** Texto do botão de ação principal */
    actionLabel?: string;
    /** Ícone do botão de ação (Lucide) */
    actionIcon?: LucideIcon;
    /** Callback ao clicar no botão de ação */
    onActionClick?: () => void;

    /** Exibir seção de perfil do usuário */
    showUserProfile?: boolean;
    /** Nome do usuário */
    userName?: string;
    /** Cargo/role do usuário */
    userRole?: string;
    /** URL da imagem de avatar */
    userAvatarUrl?: string;
    /** Iniciais do usuário (fallback quando não há imagem) */
    userInitials?: string;

    /** Conteúdo extra à direita (antes do perfil) */
    rightContent?: React.ReactNode;

    /** Classes CSS extras para o container */
    className?: string;
}

// ─── Componente ─────────────────────────────────────────────────
export function AdminHeader({
    title,
    subtitle,
    breadcrumbs,
    showSearch = true,
    searchPlaceholder = "Pesquisar...",
    searchValue,
    onSearchChange,
    actionLabel,
    actionIcon,
    onActionClick,
    showUserProfile = true,
    userName = "Admin User",
    userRole = "Gestor Principal",
    userAvatarUrl,
    userInitials = "AU",
    rightContent,
    className = "",
}: AdminHeaderProps) {
    // Verifica se tem conteúdo no lado esquerdo (título ou busca)
    const hasLeftTitle = !!title;
    const hasLeftSearch = showSearch && !hasLeftTitle;

    // Verifica se precisa de separador antes do perfil
    const hasActionOrSearch = !!actionLabel || (showSearch && hasLeftTitle);
    const needsSeparator = showUserProfile && (hasActionOrSearch || !!rightContent);

    return (
        <header
            className={`
                bg-white border-b border-border-light px-8 sticky top-0 z-10
                flex items-center justify-between font-lexend
                ${hasLeftTitle ? "py-4" : "h-16"}
                ${className}
            `}
        >
            {/* ═══ LADO ESQUERDO ═══ */}
            <div className={`flex items-center gap-6 ${hasLeftSearch ? "w-full" : hasLeftTitle ? "" : ""}`}>
                {/* Variante: Breadcrumb + Título */}
                {hasLeftTitle && (
                    <div className="flex flex-col">
                        {breadcrumbs && breadcrumbs.length > 0 && (
                            <nav className="flex items-center gap-2 mb-1">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            <span className="text-text-tertiary text-xs">/</span>
                                        )}
                                        {crumb.href ? (
                                            <a
                                                href={crumb.href}
                                                className="text-text-tertiary text-xs font-medium hover:text-primary transition-colors"
                                            >
                                                {crumb.label}
                                            </a>
                                        ) : (
                                            <span className="text-[#111718] text-xs font-medium">
                                                {crumb.label}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )}
                        <h2 className="text-[#111718] text-xl font-bold tracking-tight">{title}</h2>
                        {subtitle && (
                            <p className="text-text-tertiary text-sm mt-0.5">{subtitle}</p>
                        )}
                    </div>
                )}

                {/* Variante: Busca sozinha à esquerda */}
                {hasLeftSearch && (
                    <div className="relative w-full">
                        <Input
                            placeholder={searchPlaceholder}
                            leftIcon={Search}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full"
                        />
                    </div>
                )}
            </div>

            {/* ═══ LADO DIREITO ═══ */}
            <div className="flex items-center gap-4 shrink-0">
                {/* Busca inline (quando tem título à esquerda) */}
                {showSearch && hasLeftTitle && (
                    <div className="relative hidden lg:block">
                        <Input
                            placeholder={searchPlaceholder}
                            leftIcon={Search}
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-60"
                        />
                    </div>
                )}

                {/* Botão de ação principal */}
                {actionLabel && (
                    <div className="hidden md:flex ml-2">
                    <Botao
                        variant="primary"
                        size="md"
                        leftIcon={actionIcon}
                        onClick={onActionClick}
                        className="hidden md:flex whitespace-nowrap"
                    >
                        {actionLabel}
                    </Botao>
                    </div>
                )}

                {/* Botão mobile (só ícone) */}
                {actionLabel && actionIcon && (
                    <Botao
                        variant="primary"
                        size="md"
                        leftIcon={actionIcon}
                        onClick={onActionClick}
                        className="flex md:hidden px-3! ml-2"
                    />
                )}

                {/* Conteúdo extra customizado */}
                {rightContent}

                {/* Separador vertical */}
                {needsSeparator && (
                    <div className="h-8 w-px bg-border-light mx-0 md:mx-2" />
                )}

                {/* Perfil do usuário */}
                {showUserProfile && (
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold leading-none text-[#111718]">
                                {userName}
                            </p>
                            <p className="text-[10px] text-text-tertiary mt-1 uppercase tracking-wider">
                                {userRole}
                            </p>
                        </div>
                        <div
                            className={`
                                w-10 h-10 rounded-full border-2 border-white shadow-sm
                                flex items-center justify-center shrink-0
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
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}