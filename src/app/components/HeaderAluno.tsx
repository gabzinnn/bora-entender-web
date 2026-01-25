import AvatarAluno from "./AvatarAluno";
import Logo from "./Logo";

export default function HeaderAluno() {
    return (
        <header className="w-full h-16 bg-white shadow-md flex items-center px-8 flex-row border-b-2 border-border-lighter justify-between">
            <Logo size="md" variant="completo" />
            <AvatarAluno variant="compact" />
        </header>
    );
}