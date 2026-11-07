'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselOptions {
    totalSlides: number;
    autoPlayInterval?: number; // en millisecondes
    autoPlay?: boolean;
    pauseOnHover?: boolean;
}

interface UseCarouselReturn {
    currentIndex: number;
    isPaused: boolean;
    goToSlide: (index: number) => void;
    nextSlide: () => void;
    prevSlide: () => void;
    pause: () => void;
    resume: () => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
    progress: number; // 0 à 100, pour la barre de progression
}

export function useCarousel({
        totalSlides,
        autoPlayInterval = 5000,
        autoPlay = true,
        pauseOnHover = true,
    }: UseCarouselOptions): UseCarouselReturn {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const touchStartX = useRef<number | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);
    const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

    // Navigation
    const goToSlide = useCallback(
        (index: number) => {
            let newIndex = index;
            if (newIndex >= totalSlides) newIndex = 0;
            if (newIndex < 0) newIndex = totalSlides - 1;
            setCurrentIndex(newIndex);
            setProgress(0);
            },
        [totalSlides]
    );

    const nextSlide = useCallback(() => {
        goToSlide(currentIndex + 1);
    }, [currentIndex, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide(currentIndex - 1);
    }, [currentIndex, goToSlide]);

    // Pause / Resume
    const pause = useCallback(() => {
        setIsPaused(true);
        if (autoPlayTimer.current) {
            clearInterval(autoPlayTimer.current);
            autoPlayTimer.current = null;
        }
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    }, []);

    const resume = useCallback(() => {
        setIsPaused(false);
        setProgress(0);
    }, []);

    // Mouse events (pause on hover)
    const handleMouseEnter = useCallback(() => {
        if (pauseOnHover && autoPlay) {
            pause();
        }
    }, [pauseOnHover, autoPlay, pause]);

    const handleMouseLeave = useCallback(() => {
        if (pauseOnHover && autoPlay) {
            resume();
        }
    }, [pauseOnHover, autoPlay, resume]);

  // Touch events (swipe)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            if (touchStartX.current === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX.current - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
            touchStartX.current = null;
        },
        [nextSlide, prevSlide]
    );

  // Auto-play + barre de progression
    useEffect(() => {
        if (!autoPlay || isPaused) return;

        // Mise à jour de la progression toutes les 50ms
        const progressStep = 50;
        progressInterval.current = setInterval(() => {
        setProgress((prev) => {
            const next = prev + (progressStep / autoPlayInterval) * 100;
            return next >= 100 ? 100 : next;
        });
        }, progressStep);

        // Changement de slide après l'intervalle complet
        autoPlayTimer.current = setTimeout(() => {
            nextSlide();
            setProgress(0);
        }, autoPlayInterval);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (autoPlayTimer.current) clearTimeout(autoPlayTimer.current);
        };
    }, [autoPlay, isPaused, autoPlayInterval, currentIndex, nextSlide]);

    // Navigation au clavier
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === ' ') {
            e.preventDefault();
            if (isPaused) resume();
            else pause();
        }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide, isPaused, pause, resume]);

    return {
        currentIndex,
        isPaused,
        goToSlide,
        nextSlide,
        prevSlide,
        pause,
        resume,
        handleMouseEnter,
        handleMouseLeave,
        handleTouchStart,
        handleTouchEnd,
        progress,
    };
}