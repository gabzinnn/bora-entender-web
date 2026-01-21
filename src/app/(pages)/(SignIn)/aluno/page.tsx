'use client';
import { useAuth } from "@/app/context/authContext";

export default function HomeAluno() {
    const { signOut } = useAuth();

    return (
        <main className="w-full min-h-screen h-full flex justify-center items-center flex-col gap-4">
            <h1 className="text-red-500">Área do Aluno</h1>
            <button onClick={signOut as React.MouseEventHandler<HTMLButtonElement>} className="cursor-pointer">Sair</button>
        </main>
    )
}