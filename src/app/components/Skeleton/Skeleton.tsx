interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animate?: boolean;
}

export default function Skeleton({ 
    className = '', 
    variant = 'rectangular',
    width,
    height,
    animate = true 
}: SkeletonProps) {
    const baseClasses = animate ? 'animate-pulse bg-gray-200' : 'bg-gray-200';
    
    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: '',
        rounded: 'rounded-lg'
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div 
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}