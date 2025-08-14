import React from 'react';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    if (disabled) {
        return <span className={className}>{text}</span>;
    }

    return (
        <span
            className={`text-[#fffefebf] bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage:
                    'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)',
                backgroundSize: '200% 100%',
                backgroundRepeat: 'repeat',
                // backgroundPosition: '100% center',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
            }}
        >
            {text}
        </span>
    );
};

export default ShinyText;


