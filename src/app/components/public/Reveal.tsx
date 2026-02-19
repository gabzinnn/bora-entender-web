'use client';
import { useInView } from '@/hooks/useInView';

interface RevealProps {
    children: React.ReactNode;
    variant?: 'up' | 'scale' | 'left' | 'right';
    stagger?: number;
    className?: string;
    threshold?: number;
}

/**
 * Wrapper component that reveals its children when scrolled into view.
 * Uses CSS transitions for smooth Apple-like animations.
 */
export default function Reveal({
    children,
    variant = 'up',
    stagger,
    className = '',
    threshold = 0.15
}: RevealProps) {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold });

    const variantClass = {
        up: 'reveal',
        scale: 'reveal-scale',
        left: 'reveal-left',
        right: 'reveal-right',
    }[variant];

    const staggerClass = stagger ? `stagger-${stagger}` : '';

    return (
        <div
            ref={ref}
            className={`${variantClass} ${staggerClass} ${inView ? 'in-view' : ''} ${className}`}
        >
            {children}
        </div>
    );
}
