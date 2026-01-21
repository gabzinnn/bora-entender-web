import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-bg-secondary flex flex-col">
            {/* Header */}
            <nav className="w-full flex justify-center py-6 sm:py-8 bg-white border-b border-border-lighter">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/assets/images/logoCompleto.png"
                        alt="Bora Entender Logo"
                        width={140}
                        height={60}
                    />
                </Link>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="text-7xl font-bold text-primary">404</div>
                    <h1 className="text-3xl font-bold text-text-primary">Página não encontrada</h1>
                    <p className="text-lg text-text-secondary">
                        Desculpe, a página que você está procurando não existe.
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Voltar para Home
                    </Link>
                </div>
            </main>
        </div>
    );
}