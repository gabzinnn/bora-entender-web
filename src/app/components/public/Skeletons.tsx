export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`rounded-2xl border border-border-light bg-white p-6 animate-pulse ${className}`}>
            <div className="w-12 h-12 rounded-lg bg-gray-200 mb-4" />
            <div className="h-7 w-3/4 bg-gray-200 rounded mb-4" />
            <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
            </div>
            <div className="h-5 w-1/3 bg-gray-200 rounded" />
        </div>
    );
}

export function SkeletonPlanCard() {
    return (
        <div className="rounded-2xl border-2 border-border-light bg-white p-6 animate-pulse h-full flex flex-col">
            <div className="h-7 w-1/2 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-1/3 bg-gray-200 rounded mb-6" />
            <div className="h-10 w-2/3 bg-gray-200 rounded mb-6" />

            <div className="space-y-3 mb-8 flex-1">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                ))}
            </div>

            <div className="h-14 w-full bg-gray-200 rounded-lg mt-auto" />
        </div>
    );
}
