interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
    const sizeClasses = {
        xs: 'h-4 w-4',
        sm: 'h-8 w-8',
        md: 'h-16 w-16',
        lg: 'h-24 w-24',
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-primary`}></div>
        </div>
    );
}