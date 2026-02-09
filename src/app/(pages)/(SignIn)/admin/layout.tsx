'use client';
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== "ADMIN") {
            router.push("/login");
        }
    }, [user]);
    return (
        <>
            {children}
        </>
    )
}