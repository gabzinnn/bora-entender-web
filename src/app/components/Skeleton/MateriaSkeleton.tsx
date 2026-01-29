import Skeleton from "./Skeleton";

export default function MateriaSkeleton() {
    return (
        <main className="w-full min-h-screen h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="h-16 bg-white border-b border-gray-200" />
            
            <div className="flex-1 bg-bg-secondary px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Breadcrumb Skeleton */}
                <div className="mb-6 lg:mb-8">
                    <div className="flex items-center gap-2">
                        <Skeleton width={100} height={20} variant="rounded" />
                        <Skeleton width={20} height={20} variant="rounded" />
                        <Skeleton width={120} height={20} variant="rounded" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Sidebar Skeleton */}
                    <aside className="lg:col-span-3 flex flex-col gap-4 lg:gap-6">
                        {/* Card Info Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <Skeleton variant="circular" width={56} height={56} />
                                <div className="flex-1">
                                    <Skeleton width="80%" height={24} className="mb-2" />
                                    <Skeleton width="60%" height={16} />
                                </div>
                            </div>
                            <Skeleton width="100%" height={40} variant="rounded" />
                        </div>

                        {/* Ajuda Card Skeleton - Desktop */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <Skeleton variant="circular" width={48} height={48} className="mb-4" />
                            <Skeleton width="90%" height={20} className="mb-2" />
                            <Skeleton width="100%" height={16} className="mb-2" />
                            <Skeleton width="95%" height={16} className="mb-4" />
                            <Skeleton width="100%" height={40} variant="rounded" />
                        </div>
                    </aside>

                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-9 flex flex-col gap-6 lg:gap-8">
                        {/* Progresso Card Skeleton */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <Skeleton width={200} height={24} className="mb-6" />
                            
                            {/* Progress Bar */}
                            <div className="mb-6">
                                <Skeleton width="100%" height={8} variant="rounded" />
                                <div className="flex justify-between mt-2">
                                    <Skeleton width={60} height={16} />
                                    <Skeleton width={60} height={16} />
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i}>
                                        <Skeleton width={80} height={28} className="mb-1" />
                                        <Skeleton width={100} height={14} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Skeleton */}
                        <div className="relative pb-8 lg:pb-12 pl-2 sm:pl-4">
                            {/* Linha vertical */}
                            <div className="absolute left-[2.9rem] sm:left-[3.65rem] top-8 bottom-0 w-0.75 bg-gray-200" />
                            
                            {/* Tópicos Skeleton */}
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="relative pl-16 sm:pl-20 mb-6 last:mb-0">
                                    {/* Ícone circular */}
                                    <div className="absolute left-0 top-0">
                                        <Skeleton variant="circular" width={48} height={48} className="sm:w-14 sm:h-14" />
                                    </div>

                                    {/* Card do tópico */}
                                    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                                            <div className="flex-1">
                                                <Skeleton width={100} height={14} className="mb-2" />
                                                <Skeleton width="90%" height={20} className="mb-2" />
                                                <Skeleton width="100%" height={16} className="mb-2" />
                                                <Skeleton width="85%" height={16} />
                                            </div>
                                            <Skeleton width={100} height={32} variant="rounded" className="sm:mt-1" />
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <Skeleton width="100%" height={6} variant="rounded" />
                                            <div className="flex justify-between items-center mt-2">
                                                <Skeleton width={80} height={14} />
                                                <Skeleton width={60} height={14} />
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-gray-100">
                                            <Skeleton width={80} height={14} />
                                            <Skeleton width={80} height={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ajuda Card Skeleton - Mobile */}
                    <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <Skeleton variant="circular" width={48} height={48} className="mb-4" />
                        <Skeleton width="90%" height={20} className="mb-2" />
                        <Skeleton width="100%" height={16} className="mb-2" />
                        <Skeleton width="95%" height={16} className="mb-4" />
                        <Skeleton width="100%" height={40} variant="rounded" />
                    </div>
                </div>
            </div>
        </main>
    );
}