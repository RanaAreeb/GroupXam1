'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
export const LazyWhiteboard = dynamic(() => import('./Whiteboard'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
    ssr: false
});

export const LazyCanvasReveal = dynamic(() => import('./CanvasReveal'), {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
    ssr: false
});

// Performance monitoring hook
export const usePerformanceOptimizer = () => {
    useEffect(() => {
        // Preload critical resources
        const preloadCriticalResources = () => {
            const criticalImages = [
                '/logo.png',
                '/logo-white.png'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        };

        // Optimize images on scroll
        const optimizeImagesOnScroll = () => {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        img.src = img.dataset.src || '';
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        };

        // Initialize optimizations
        preloadCriticalResources();
        optimizeImagesOnScroll();

        // Cleanup
        return () => {
            // Cleanup if needed
        };
    }, []);
};

// Resource hints component
export const ResourceHints = () => {
    useEffect(() => {
        // Add resource hints for better performance
        const addResourceHints = () => {
            const hints = [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
                { rel: 'dns-prefetch', href: '//www.google-analytics.com' }
            ];

            hints.forEach(hint => {
                const link = document.createElement('link');
                Object.assign(link, hint);
                document.head.appendChild(link);
            });
        };

        addResourceHints();
    }, []);

    return null;
};

export default usePerformanceOptimizer;
