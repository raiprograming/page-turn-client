import { useRef, useState, type WheelEvent } from 'react';
import { useNavigate } from 'react-router';
import type { BookPage } from '../../api';

const WHEEL_THROTTLE_MS = 600;
const WHEEL_DELTA_THRESHOLD = 10;

export interface TinderCardApi {
    swipe: (dir?: 'left' | 'right' | 'up' | 'down') => Promise<void>;
    restoreCard: () => Promise<void>;
}

function useReadingView(pages: BookPage[]) {
    const navigate = useNavigate();
    const cardRef = useRef<TinderCardApi | null>(null);
    const lastWheelTimeRef = useRef(0);
    const [pageIndex, setPageIndex] = useState(0);

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
