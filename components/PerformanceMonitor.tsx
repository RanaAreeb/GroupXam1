'use client';

import { useEffect } from 'react';

export const PerformanceMonitor = () => {
    useEffect(() => {
        // Monitor Core Web Vitals
        const measurePerformance = () => {
            // Measure LCP (Largest Contentful Paint)
            if ('PerformanceObserver' in window) {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    console.log('LCP:', lastEntry.startTime);

                    // Send to analytics if needed
                    if (window.gtag) {
                        window.gtag('event', 'web_vitals', {
                            name: 'LCP',
                            value: Math.round(lastEntry.startTime),
                            event_category: 'Web Vitals'
                        });
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // Measure FID (First Input Delay)
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FID:', entry.processingStart - entry.startTime);

                        if (window.gtag) {
                            window.gtag('event', 'web_vitals', {
                                name: 'FID',
                                value: Math.round(entry.processingStart - entry.startTime),
                                event_category: 'Web Vitals'
                            });
                        }
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // Measure CLS (Cumulative Layout Shift)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    console.log('CLS:', clsValue);

                    if (window.gtag) {
                        window.gtag('event', 'web_vitals', {
                            name: 'CLS',
                            value: Math.round(clsValue * 1000),
                            event_category: 'Web Vitals'
                        });
                    }
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });

                // Measure FCP (First Contentful Paint)
                const fcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        console.log('FCP:', entry.startTime);

                        if (window.gtag) {
                            window.gtag('event', 'web_vitals', {
                                name: 'FCP',
                                value: Math.round(entry.startTime),
                                event_category: 'Web Vitals'
                            });
                        }
                    });
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
            }

            // Monitor resource loading performance
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.duration > 1000) { // Log slow resources (>1s)
                        console.warn('Slow resource:', {
                            name: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize
                        });
                    }
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });

            // Monitor navigation timing
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

                const metrics = {
                    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                    tcp: navigation.connectEnd - navigation.connectStart,
                    request: navigation.responseStart - navigation.requestStart,
                    response: navigation.responseEnd - navigation.responseStart,
                    dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    load: navigation.loadEventEnd - navigation.loadEventStart,
                    total: navigation.loadEventEnd - navigation.navigationStart
                };

                console.log('Navigation timing:', metrics);

                // Send performance data to analytics
                if (window.gtag) {
                    window.gtag('event', 'performance_metrics', {
                        event_category: 'Performance',
                        custom_map: {
                            dns_time: metrics.dns,
                            tcp_time: metrics.tcp,
                            request_time: metrics.request,
                            response_time: metrics.response,
                            dom_time: metrics.dom,
                            load_time: metrics.load,
                            total_time: metrics.total
                        }
                    });
                }
            });
        };

        // Initialize performance monitoring
        measurePerformance();

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            const checkMemory = () => {
                const memory = (performance as any).memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('High memory usage detected:', {
                        used: memory.usedJSHeapSize,
                        total: memory.jsHeapSizeLimit,
                        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
                    });
                }
            };

            // Check memory every 30 seconds
            const memoryInterval = setInterval(checkMemory, 30000);

            return () => {
                clearInterval(memoryInterval);
            };
        }
    }, []);

    return null;
};

// Hook for measuring component render performance
export const useRenderPerformance = (componentName: string) => {
    useEffect(() => {
        const startTime = performance.now();

        return () => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;

            if (renderTime > 16) { // Log slow renders (>16ms)
                console.warn(`Slow render in ${componentName}:`, renderTime + 'ms');
            }
        };
    });
};

export default PerformanceMonitor;
