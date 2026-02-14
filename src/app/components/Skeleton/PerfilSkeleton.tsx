import Skeleton from "./Skeleton";

export default function PerfilSkeleton() {
    return (
        <div className="w-full min-h-screen h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="w-full bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-4">
                    <Skeleton variant="rounded" width={40} height={40} />
                    <Skeleton width={160} height={28} className="rounded-lg" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full px-8 py-8 flex flex-col gap-6">
                {/* Avatar & Nome Card Skeleton */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Skeleton variant="circular" width={96} height={96} />
                        <div className="flex-1 flex flex-col items-center sm:items-start gap-2">
                            <Skeleton width={220} height={28} className="rounded-lg" />
                            <Skeleton width={180} height={18} className="rounded-lg" />
                            <Skeleton variant="rounded" width={100} height={24} />
                        </div>
                        <Skeleton variant="rounded" width={100} height={40} />
                    </div>
                </div>

                {/* Estatísticas Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div 
                            key={i} 
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2"
                        >
                            <Skeleton variant="rounded" width={44} height={44} />
                            <Skeleton width={72} height={12} className="rounded" />
                            <Skeleton width={56} height={22} className="rounded-lg" />
                        </div>
                    ))}
                </div>

                {/* Two Column Layout Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Informações Pessoais Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <Skeleton width={200} height={22} className="rounded-lg mb-5" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4 py-3">
                                    <Skeleton variant="rounded" width={36} height={36} />
                                    <div className="flex-1 flex flex-col gap-1.5">
                                        <Skeleton width={100} height={14} className="rounded" />
                                        <Skeleton width={180} height={16} className="rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Segurança Skeleton */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-5">
                            <Skeleton width={120} height={22} className="rounded-lg" />
                            <Skeleton variant="rounded" width={130} height={36} />
                        </div>
                        <Skeleton width="90%" height={16} className="rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
