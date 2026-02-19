import { PublicHeader, PublicFooter } from "@/app/components/public/PublicSiteLayout";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <PublicHeader />
            <main className="flex-1 py-14 sm:py-20">{children}</main>
            <PublicFooter />
        </div>
    );
}
