import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { newsService, type NewsListItem } from '../../api';
import { buildAssetUrl } from '../Admin/News/use-news';

// Minimum interval between scroll-triggered navigations to avoid firing on every wheel tick.
const SCROLL_THROTTLE_MS = 600;
// Minimum horizontal wheel delta required to treat the gesture as an intentional scroll.
const SCROLL_DELTA_THRESHOLD = 10;

function useIntelligence() {
    const [searchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page')) || 1;

    const [activePage, setActivePage] = useState(initialPage);
    const [reloadKey, setReloadKey] = useState(0);
    const [newsList, setNewsList] = useState<NewsListItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const lastScrollTimeRef = useRef(0);

    useEffect(() => {
        let isActive = true;

        const loadNewsList = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await newsService.getNewsList(activePage);

                if (!isActive) {
                    return;
                }

                if (response && typeof response === 'object' && 'error' in response && response.error) {
                    throw new Error(response.error);
                }

                setNewsList(response as NewsListItem[]);
                setCurrentIndex(0);
            } catch (error: unknown) {
                if (isActive) {
                    setNewsList([]);
                    setErrorMessage(error instanceof Error ? error.message : 'Failed to load news.');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadNewsList();

        return () => {
            isActive = false;
        };
    }, [activePage, reloadKey]);

    const currentNews = newsList[currentIndex] ?? null;
    const hasMoreNews = currentIndex < newsList.length;
    const isAtFirstItem = activePage === 1 && currentIndex === 0;

    // Advances the stack so the next news item is rendered.
    const goToNextNews = () => {
        setCurrentIndex((previousIndex) => previousIndex + 1);
    };

    // Steps back to the previous news item, if any.
    const goToPreviousNews = () => {
        if (isAtFirstItem) {
            return;
        }

        setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0));
    };

    // Swiping right shows the previous item, any other direction advances to the next one.
    const handleCardLeftScreen = (direction: 'left' | 'right' | 'up' | 'down') => {
        if (direction === 'right') {
            goToPreviousNews();
        } else {
            goToNextNews();
        }
    };

    // Restarts the feed from page 1, used when scrolling away from the "caught up" screen.
    const reloadFromStart = () => {
        setActivePage(1);
        setReloadKey((previousKey) => previousKey + 1);
    };

    // Handles horizontal wheel scroll: scrolling left goes to the previous item,
    // and scrolling while caught up re-initializes the feed from page 1.
    const handleScroll = (deltaX: number) => {
        const now = Date.now();
        if (now - lastScrollTimeRef.current < SCROLL_THROTTLE_MS) {
            return;
        }

        if (!hasMoreNews) {
            lastScrollTimeRef.current = now;
            reloadFromStart();
            return;
        }

        if (deltaX < -SCROLL_DELTA_THRESHOLD) {
            lastScrollTimeRef.current = now;
            goToPreviousNews();
        }
    };

    const handleSave = () => {
        console.log('Saved news:', currentNews?._id);
    };

    const handleShare = () => {
        console.log('Shared news:', currentNews?._id);
    };

    const getCoverImageUrl = (item: NewsListItem) => {
        const imageName = item.image?.[0]?.name;
        return imageName ? buildAssetUrl(imageName) : '';
    };

    return {
        currentNews,
        hasMoreNews,
        isAtFirstItem,
        loading,
        errorMessage,
        handleCardLeftScreen,
        handleScroll,
        handleSave,
        handleShare,
        getCoverImageUrl,
        reloadFromStart,
    };
}

export default useIntelligence;
