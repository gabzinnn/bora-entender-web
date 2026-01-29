import Skeleton from "./Skeleton";

export default function HomeAlunoSkeleton() {
    return (
        <main className="w-full min-h-screen h-full flex flex-col p-8">
            {/* Header Skeleton */}
            <div className="w-full flex flex-col md:flex-row mb-8 items-center">
                {/* Logo Skeleton */}
                <Skeleton variant="circular" width={64} height={64} />
                
                {/* Saudação Skeleton */}
                <div className="flex flex-col ml-6 flex-1">
                    <Skeleton width={250} height={40} className="mb-2" />
                    <Skeleton width={320} height={24} />
                </div>

                {/* Avatar Skeleton */}
                <div className="relative ml-auto md:w-auto w-full mt-4 md:mt-0">
                    <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-full border border-gray-100 shadow-sm">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div className="hidden md:block">
                            <Skeleton width={100} height={16} className="mb-1" />
                            <Skeleton width={80} height={14} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards de Estatísticas Skeleton */}
            <div className="flex flex-col md:flex-row gap-6 bg-bg-secondary mb-8">
                {[1, 2, 3].map((i) => (
                    <div 
                        key={i}
                        className="w-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5"
                    >
                        <Skeleton variant="rounded" width={48} height={48} />
                        <div className="flex-1">
                            <Skeleton width={100} height={14} className="mb-2" />
                            <Skeleton width={60} height={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Título "Minhas Matérias" Skeleton */}
            <Skeleton width={180} height={24} className="mt-[6vh] mb-4" />

            {/* Grid de Matérias Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div 
                        key={i}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col"
                    >
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton variant="rounded" width={40} height={40} />
                                <div>
                                    <Skeleton width={120} height={20} className="mb-1" />
                                    <Skeleton width={80} height={14} />
                                </div>
                            </div>
                            <Skeleton variant="rounded" width={60} height={24} />
                        </div>

                        {/* Descrição */}
                        <Skeleton width="100%" height={16} className="mb-2" />
                        <Skeleton width="90%" height={16} className="mb-4" />

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <Skeleton width={60} height={14} />
                                <Skeleton width={40} height={14} />
                            </div>
                            <Skeleton width="100%" height={8} variant="rounded" />
                        </div>

                        {/* Botão */}
                        <Skeleton width="100%" height={40} variant="rounded" />
                    </div>
                ))}
            </div>
        </main>
    );
}