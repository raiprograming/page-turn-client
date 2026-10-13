import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { newsService, type NewsListItem } from '../../api';
import { buildAssetUrl } from '../Admin/News/use-news';

function useIntelligenceDetail() {
    const { meta: newsId } = useParams<{ meta: string }>();

    const [news, setNews] = useState<NewsListItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!newsId) {
            setNews(null);
            setErrorMessage('News id is required.');
            return;
        }

        let isActive = true;

        const loadNews = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await newsService.getNewsDetail(newsId);

                if (!isActive) {
                    return;
                }

                if (response && typeof response === 'object' && 'error' in response && response.error) {
                    throw new Error(response.error);
                }

                setNews(response as NewsListItem);
            } catch (error: unknown) {
                if (isActive) {
                    setNews(null);
                    setErrorMessage(error instanceof Error ? error.message : 'Failed to load news.');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadNews();

        return () => {
            isActive = false;
        };
    }, [newsId]);

    const getCoverImageUrl = (item: NewsListItem) => {
        const imageName = item.image?.[0]?.name;
        return imageName ? buildAssetUrl(imageName) : '';
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

    return {
        news,
        loading,
        errorMessage,
        getCoverImageUrl,
        handleSave,
        isToastOpen,
        toastMessage,
        closeToast,
    };
}

export default useIntelligenceDetail;
