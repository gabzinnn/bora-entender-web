import { BookOpenText } from "lucide-react";

type CourseCardProps = {
    id: number;
    nome: string;
    descricao: string | null;
    cor: string | null;
    topicos: number;
};

export function CourseCard({ nome, descricao, cor, topicos }: CourseCardProps) {
    return (
        <article
            className="flex flex-col rounded-2xl border border-border-light bg-white h-full overflow-hidden"
            style={{ borderTopColor: cor || "#00ccf0", borderTopWidth: 4 }}
        >
            <div className="p-6 flex flex-col flex-1">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 shrink-0"
                    style={{ backgroundColor: `${cor || "#00ccf0"}1a`, color: cor || "#00ccf0" }}
                >
                    <BookOpenText className="w-6 h-6" />
                </div>

                <h2 className="font-bold text-xl mb-2">{nome}</h2>

                {/* Descrição com altura fixa via line-clamp */}
                <p className="text-text-secondary mb-4 line-clamp-3 flex-1">
                    {descricao || "Conteúdo estruturado para facilitar o entendimento da matéria."}
                </p>

                <p className="text-sm font-medium text-text-primary mt-auto">
                    {topicos} tópico{topicos !== 1 ? "s" : ""} disponíve{topicos !== 1 ? "is" : "l"}
                </p>
            </div>
        </article>
    );
}
