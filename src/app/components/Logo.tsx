import Image from "next/image";

interface LogoProps {
    size?: "sm" | "md" | "lg" | "xl" | "xxl";
    variant?: "completo" | "icone";
    className?: string;
}

const sizeMap = {
    sm: 32,
    md: 48,
    lg: 96,
    xl: 150,
    xxl: 200,
};

export default function Logo({ 
    size = "md", 
    variant = "completo",
    className = ""
}: LogoProps) {
    const pixelSize = sizeMap[size];

    if (variant === "icone") {
        return (
            <Image
                src="/assets/images/logoMenor.png"
                alt="Logo Bora Entender"
                width={pixelSize}
                height={pixelSize}
                className={className}
            />
        );
    }

    return (
        <Image
            src="/assets/images/logoCompleto.png"
            alt="Logo Bora Entender"
            width={pixelSize}
            height={pixelSize}
            className={className}
        />
    );
}