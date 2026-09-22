import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { newsService, type NewsListItem } from '../../api';
import { buildAssetUrl } from '../Admin/News/use-news';

function useIntelligence() {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;

    const [newsList, setNewsList] = useState<NewsListItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isActive = true;

        const loadNewsList = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await newsService.getNewsList(page);

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
    }, [page]);

    const currentNews = newsList[currentIndex] ?? null;
    const hasMoreNews = currentIndex < newsList.length;

    // Advances the stack so the next news item is rendered.
    const goToNextNews = () => {
        setCurrentIndex((previousIndex) => previousIndex + 1);
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
        loading,
        errorMessage,
        goToNextNews,
        handleSave,
        handleShare,
        getCoverImageUrl,
    };
}

export default useIntelligence;
