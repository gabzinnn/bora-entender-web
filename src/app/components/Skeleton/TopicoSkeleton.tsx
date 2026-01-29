import Skeleton from "./Skeleton";

export default function TopicoSkeleton() {
    return (
        <main className="w-full min-h-screen h-full flex flex-col">
            {/* Header */}
            <div className="h-16 bg-white border-b border-gray-200" />
            
            <div className="flex-1 bg-bg-secondary px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb Skeleton */}
                <div className="mb-6">
                    <div className="flex items-center gap-2">
                        <Skeleton width={60} height={20} variant="rounded" />
                        <Skeleton width={20} height={20} variant="rounded" />
                        <Skeleton width={100} height={20} variant="rounded" />
                        <Skeleton width={20} height={20} variant="rounded" />
                        <Skeleton width={80} height={20} variant="rounded" />
                        <Skeleton width={20} height={20} variant="rounded" />
                        <Skeleton width={120} height={20} variant="rounded" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Content Viewer Skeleton */}
                    <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-150">
                            {/* Toolbar */}
                            <div className="p-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Skeleton variant="rounded" width={32} height={32} />
                                    <Skeleton width={200} height={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton variant="rounded" width={32} height={32} />
                                    <Skeleton width={50} height={20} />
                                    <Skeleton variant="rounded" width={32} height={32} />
                                    <Skeleton variant="rounded" width={32} height={32} />
                                    <Skeleton variant="rounded" width={32} height={32} />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-8 bg-gray-100 flex justify-center">
                                <div className="w-full max-w-3xl bg-white p-12 rounded-sm">
                                    <Skeleton width="70%" height={36} className="mb-2" />
                                    <Skeleton width={150} height={16} className="mb-8" />
                                    
                                    <Skeleton width="100%" height={20} className="mb-3" />
                                    <Skeleton width="95%" height={20} className="mb-3" />
                                    <Skeleton width="90%" height={20} className="mb-6" />
                                    
                                    <Skeleton width="100%" height={192} variant="rounded" className="mb-6" />
                                    
                                    <Skeleton width={250} height={28} className="mb-4" />
                                    <Skeleton width="100%" height={20} className="mb-3" />
                                    <Skeleton width="98%" height={20} className="mb-3" />
                                    <Skeleton width="92%" height={20} className="mb-6" />
                                    
                                    <Skeleton width="100%" height={80} variant="rounded" />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                                <Skeleton width={100} height={40} variant="rounded" />
                                <Skeleton width={160} height={44} variant="rounded" />
                                <Skeleton width={100} height={40} variant="rounded" />
                            </div>
                        </div>

                        {/* Notes Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton variant="rounded" width={24} height={24} />
                                    <Skeleton width={150} height={20} />
                                </div>
                                <Skeleton variant="rounded" width={24} height={24} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                        {/* Progress Card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <div className="flex items-center justify-between mb-4">
                                <Skeleton width={120} height={20} />
                                <Skeleton width={50} height={24} variant="rounded" />
                            </div>
                            <Skeleton width="100%" height={10} variant="rounded" className="mb-2" />
                            <div className="flex justify-end">
                                <Skeleton width={180} height={14} />
                            </div>
                        </div>

                        {/* Module List */}
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <Skeleton width={100} height={14} className="mb-2" />
                                <Skeleton width="90%" height={24} />
                            </div>
                            
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3 p-4 border-b border-gray-100">
                                    <Skeleton variant="circular" width={24} height={24} />
                                    <div className="flex-1">
                                        <Skeleton width="80%" height={16} className="mb-2" />
                                        <div className="flex items-center gap-2">
                                            <Skeleton width={16} height={16} />
                                            <Skeleton width={60} height={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Duvidas Banner */}
                        <Skeleton width="100%" height={140} variant="rounded" />
                    </aside>
                </div>
            </div>
        </main>
    );
}