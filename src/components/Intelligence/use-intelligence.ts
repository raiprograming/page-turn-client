import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { newsService, type NewsListItem } from '../../api';
import { buildAssetUrl } from '../Admin/News/use-news';
import { shareNews } from './share-news';

// Query param used to deep-link into a single news item, e.g. /intelligence?meta=<newsId>.
const META_PARAM = 'meta';

// Minimum interval between scroll-triggered navigations to avoid firing on every wheel tick.
const SCROLL_THROTTLE_MS = 600;
// Minimum horizontal wheel delta required to treat the gesture as an intentional scroll.
const SCROLL_DELTA_THRESHOLD = 10;

function useIntelligence() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPage = Number(searchParams.get('page')) || 1;
    const metaNewsId = searchParams.get(META_PARAM);
    const isSpecificView = Boolean(metaNewsId);

    const [activePage, setActivePage] = useState(initialPage);
    const [reloadKey, setReloadKey] = useState(0);
    const [newsList, setNewsList] = useState<NewsListItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const lastScrollTimeRef = useRef(0);

    const [specificNews, setSpecificNews] = useState<NewsListItem | null>(null);
    const [specificNewsLoading, setSpecificNewsLoading] = useState(false);
    const [specificNewsError, setSpecificNewsError] = useState('');

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

    // Loads a single news item by id whenever the `meta` query param is present.
    useEffect(() => {
        if (!metaNewsId) {
            setSpecificNews(null);
            setSpecificNewsError('');
            return;
        }

        let isActive = true;

        const loadSpecificNews = async () => {
            setSpecificNewsLoading(true);
            setSpecificNewsError('');

            try {
                const response = await newsService.getNewsDetail(metaNewsId);

                if (!isActive) {
                    return;
                }

                if (response && typeof response === 'object' && 'error' in response && response.error) {
                    throw new Error(response.error);
                }

                setSpecificNews(response as NewsListItem);
            } catch (error: unknown) {
                if (isActive) {
                    setSpecificNews(null);
                    setSpecificNewsError(error instanceof Error ? error.message : 'Failed to load news.');
                }
            } finally {
                if (isActive) {
                    setSpecificNewsLoading(false);
                }
            }
        };

        void loadSpecificNews();

        return () => {
            isActive = false;
        };
    }, [metaNewsId]);

    const currentNews = isSpecificView ? specificNews : (newsList[currentIndex] ?? null);
    const hasMoreNews = isSpecificView ? Boolean(specificNews) : currentIndex < newsList.length;
    // Previous news navigation is always disabled while viewing a specific (deep-linked) news item.
    const isAtFirstItem = isSpecificView || (activePage === 1 && currentIndex === 0);

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

    // Removes the `meta` query param, returning the feed to the paginated news list view.
    const exitSpecificView = () => {
        setSearchParams((previousParams) => {
            const nextParams = new URLSearchParams(previousParams);
            nextParams.delete(META_PARAM);
            return nextParams;
        });
    };

    // Swiping right shows the previous item, any other direction advances to the next one.
    // While viewing a specific (deep-linked) news item, any swipe exits back to the paginated list.
    const handleCardLeftScreen = (direction: 'left' | 'right' | 'up' | 'down') => {
        if (isSpecificView) {
            exitSpecificView();
            return;
        }

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

    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const closeToast = () => {
        setIsToastOpen(false);
    };

    const handleSave = () => {
        setToastMessage('Intelligence saved for you');
        setIsToastOpen(true);
    };

    const handleShare = async () => {
        const newsId = isSpecificView ? metaNewsId : currentNews?._id;

        if (!currentNews || !newsId) {
            return;
        }

        await shareNews(currentNews, newsId);
    };

    const getCoverImageUrl = (item: NewsListItem) => {
        const imageName = item.image?.[0]?.name;
        return imageName ? buildAssetUrl(imageName) : '';
    };

    return {
        currentNews,
        hasMoreNews,
        isAtFirstItem,
        isSpecificView,
        loading: isSpecificView ? specificNewsLoading : loading,
        errorMessage: isSpecificView ? specificNewsError : errorMessage,
        handleCardLeftScreen,
        handleScroll,
        handleSave,
        handleShare,
        getCoverImageUrl,
        reloadFromStart,
        exitSpecificView,
        isToastOpen,
        toastMessage,
        closeToast,
    };
}

export default useIntelligence;
