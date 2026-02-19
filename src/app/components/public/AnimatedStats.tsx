'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Video, Users, Clock } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import api from '@/services/axios';

interface StatsData {
    totalConteudos: number;
    totalMaterias: number;
    totalAlunos: number;
    acessoHoras: number;
}

function AnimatedCounter({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!started || target === 0) return;

        let raf: number;
        const duration = 2000;
        const startTime = performance.now();

        const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);

            setCount(Math.floor(easedProgress * target));

            if (progress < 1) {
                raf = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [started, target]);

    return (
        <span className="font-heading text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
            {count}{suffix}
        </span>
    );
}

export default function AnimatedStats() {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 });
    const [data, setData] = useState<StatsData | null>(null);

    useEffect(() => {
        api.get('/public/stats')
            .then(res => setData(res.data))
            .catch(err => console.error('Erro ao carregar stats', err));
    }, []);

    const stats = [
        { label: 'Aulas disponíveis', value: data?.totalConteudos ?? 0, suffix: '+', icon: Video, color: 'text-primary', bgColor: 'bg-primary/10' },
        { label: 'Alunos cadastrados', value: data?.totalAlunos ?? 0, suffix: '+', icon: Users, color: 'text-primary-alt', bgColor: 'bg-primary-alt/10' },
        { label: 'Matérias cobertas', value: data?.totalMaterias ?? 0, suffix: '+', icon: BookOpen, color: 'text-brand-red', bgColor: 'bg-brand-red/10' },
        { label: 'Acesso a conteúdo', value: data?.acessoHoras ?? 24, suffix: '/7', icon: Clock, color: 'text-brand-yellow', bgColor: 'bg-brand-yellow/10' },
    ];

    return (
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.label}
                        className={`reveal-scale stagger-${index + 1} ${inView ? 'in-view' : ''} flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-border-light shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${stat.bgColor}`}>
                            <Icon size={28} className={stat.color} />
                        </div>
                        <div className={stat.color}>
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} started={inView && data !== null} />
                        </div>
                        <p className="text-text-secondary text-sm sm:text-base mt-2 font-medium">{stat.label}</p>
                    </div>
                );
            })}
        </div>
    );
}
