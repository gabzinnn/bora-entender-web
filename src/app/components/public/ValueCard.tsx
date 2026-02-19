import { type LucideIcon } from "lucide-react";

type ValueCardProps = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export function ValueCard({ title, description, icon: Icon }: ValueCardProps) {
    return (
        <article className="flex flex-col rounded-xl border border-border-light p-6 bg-bg-secondary h-full">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-xl mb-2">{title}</h2>
            <p className="text-text-secondary leading-relaxed flex-1">{description}</p>
        </article>
    );
}
