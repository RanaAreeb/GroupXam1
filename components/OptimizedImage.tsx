'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
    placeholder?: 'blur' | 'empty';
    quality?: number;
    sizes?: string;
    fill?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    placeholder = 'blur',
    quality = 85,
    sizes,
    fill = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Generate blur placeholder
    const blurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    // Optimize image loading
    useEffect(() => {
        if (priority) {
            const img = new window.Image();
            img.src = src;
        }
    }, [src, priority]);

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width: width || '100%', height: height || '200px' }}
            >
                <span className="text-gray-500 text-sm">Image failed to load</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                priority={priority}
                quality={quality}
                sizes={sizes}
                placeholder={placeholder}
                blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
                onLoad={handleLoad}
                onError={handleError}
                className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                {...props}
            />
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
};

// Lazy image component for below-the-fold content
export const LazyImage: React.FC<OptimizedImageProps> = (props) => {
    const [isInView, setIsInView] = useState(false);
    const [ref, setRef] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(ref);
        return () => observer.disconnect();
    }, [ref]);

    return (
        <div ref={setRef} className={props.className}>
            {isInView ? (
                <OptimizedImage {...props} />
            ) : (
                <div
                    className="bg-gray-200 animate-pulse"
                    style={{
                        width: props.width || '100%',
                        height: props.height || '200px'
                    }}
                />
            )}
        </div>
    );
};

export default OptimizedImage;
