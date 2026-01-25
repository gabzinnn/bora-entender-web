import AlunoSidebar from "@/app/components/AlunoSidebar";

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-screen flex flex-row overflow-hidden">
            {/* <AlunoSidebar /> */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    )
}