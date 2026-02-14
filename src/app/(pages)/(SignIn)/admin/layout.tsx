'use client';
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== "ADMIN")) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading) return null;

    return (
        <>
            {children}
        </>
    )
}