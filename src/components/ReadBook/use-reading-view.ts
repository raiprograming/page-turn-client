import { useEffect, useRef, useState, type WheelEvent } from 'react';
import { useNavigate } from 'react-router';
import type { BookPage } from '../../api';

const WHEEL_THROTTLE_MS = 600;
const WHEEL_DELTA_THRESHOLD = 10;
const AXIS_LOCK_PX = 6;

export interface TinderCardApi {
    swipe: (dir?: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
}

function useReadingView(pages: BookPage[]) {
    const navigate = useNavigate();
    const cardRef = useRef<TinderCardApi | null>(null);
    const lastWheelTimeRef = useRef(0);
    const bodyRef = useRef<HTMLDivElement | null>(null);
    const [pageIndex, setPageIndex] = useState(0);

    // react-tinder-card translates the card on both axes for every touchmove, which makes the
    // card wobble while scrolling. Lock the gesture axis and hide vertical moves from the card.
    useEffect(() => {
        const body = bodyRef.current;
        if (!body) return undefined;

        let start = { x: 0, y: 0 };
        let axis: 'x' | 'y' | null = null;

        const onTouchStart = (ev: TouchEvent) => {
            start = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
            axis = null;
        };
        const onTouchMove = (ev: TouchEvent) => {
            if (!axis) {
                const dx = Math.abs(ev.touches[0].clientX - start.x);
                const dy = Math.abs(ev.touches[0].clientY - start.y);
                if (dx < AXIS_LOCK_PX && dy < AXIS_LOCK_PX) {
                    ev.stopPropagation();
                    return;
                }
                axis = dx > dy ? 'x' : 'y';
            }
            if (axis === 'y') ev.stopPropagation();
        };

        body.addEventListener('touchstart', onTouchStart, { passive: true });
        body.addEventListener('touchmove', onTouchMove, { passive: true });
        return () => {
            body.removeEventListener('touchstart', onTouchStart);
            body.removeEventListener('touchmove', onTouchMove);
        };
    }, [pageIndex]);

    const totalPages = pages.length;
    const currentPage = pages[pageIndex] ?? null;
    const isFirstPage = pageIndex === 0;
    const isLastPage = pageIndex >= totalPages - 1;
    const progressPercent = totalPages ? Math.round(((pageIndex + 1) / totalPages) * 100) : 0;
    const pageLabel = `Page ${String(pageIndex + 1).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;

    // Swiping left moves to the next page, swiping right moves back.
    const preventSwipe: Array<'left' | 'right' | 'up' | 'down'> = ['up', 'down'];
    if (isFirstPage) preventSwipe.push('right');
    if (isLastPage) preventSwipe.push('left');

    const handleCardLeftScreen = (direction: 'left' | 'right' | 'up' | 'down') => {
        if (direction === 'left') {
            setPageIndex((index) => Math.min(index + 1, totalPages - 1));
        } else if (direction === 'right') {
            setPageIndex((index) => Math.max(index - 1, 0));
        }
    };

    const handleTurnPage = () => {
        if (!isLastPage) {
            void cardRef.current?.swipe('left');
        }
    };

    const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
        const now = Date.now();
        if (now - lastWheelTimeRef.current < WHEEL_THROTTLE_MS) return;
        if (Math.abs(event.deltaX) < WHEEL_DELTA_THRESHOLD) return;

        if (event.deltaX > 0 && !isLastPage) {
            lastWheelTimeRef.current = now;
            void cardRef.current?.swipe('left');
        } else if (event.deltaX < 0 && !isFirstPage) {
            lastWheelTimeRef.current = now;
            void cardRef.current?.swipe('right');
        }
    };

    const handleExit = () => navigate('/read');

    return {
        cardRef,
        bodyRef,
        currentPage,
        isLastPage,
        progressPercent,
        pageLabel,
        preventSwipe,
        handleCardLeftScreen,
        handleTurnPage,
        handleWheel,
        handleExit,
    };
}

export default useReadingView;
