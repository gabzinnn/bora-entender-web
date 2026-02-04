import Skeleton from './Skeleton';

export default function ConteudoSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-125">
            {/* Toolbar Skeleton */}
            <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 bg-gray-50/50 gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Skeleton variant="circular" width={18} height={18} />
                    <Skeleton variant="text" className="h-5 flex-1 max-w-xs" />
                </div>
                
                <div className="flex items-center gap-1">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="relative grow overflow-y-auto flex justify-center bg-gray-100 p-4 sm:p-8">
                <div className="w-full max-w-4xl space-y-4">
                    {/* Simula conteúdo de texto/PDF */}
                    <Skeleton variant="text" className="h-6 w-3/4" />
                    <Skeleton variant="text" className="h-6 w-full" />
                    <Skeleton variant="text" className="h-6 w-5/6" />
                    <Skeleton variant="text" className="h-6 w-full" />
                    
                    <div className="my-6">
                        <Skeleton variant="rounded" className="h-64 w-full" />
                    </div>
                    
                    <Skeleton variant="text" className="h-6 w-full" />
                    <Skeleton variant="text" className="h-6 w-4/5" />
                    <Skeleton variant="text" className="h-6 w-full" />
                    <Skeleton variant="text" className="h-6 w-2/3" />
                </div>
            </div>

            {/* Footer Navigation Skeleton */}
            <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex justify-between items-center gap-2">
                <Skeleton variant="rounded" className="h-10 w-28" />
                
                <div className="flex items-center gap-2">
                    <Skeleton variant="text" className="h-5 w-20" />
                </div>
                
                <Skeleton variant="rounded" className="h-10 w-28" />
            </div>
        </div>
    );
}