"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { publicNavLinks } from "./PublicSiteLayout";

export function PublicNavigation() {
    const pathname = usePathname();

    return (
        <nav className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.label}
                        className={`font-montserrat font-semibold text-lg transition-colors ${isActive ? "text-primary" : "text-text-primary hover:text-primary"
                            }`}
                        href={link.href}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}
