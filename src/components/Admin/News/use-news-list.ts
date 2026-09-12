import { useEffect, useState, type ChangeEvent } from 'react';
import { newsService, type NewsListItem } from '../../../api';
import { fetchNewsList } from './use-news';

const PAGE_SIZE = 5;

function useNewsList() {
    const [newsList, setNewsList] = useState<NewsListItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        let isActive = true;

        const loadNewsList = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const items = await fetchNewsList({ page, limit: PAGE_SIZE });

                if (!isActive) {
                    return;
                }

                setNewsList(items);
                setTotalPages((previousTotalPages) =>
                    items.length === PAGE_SIZE ? Math.max(previousTotalPages, page + 1) : page,
                );
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
    }, [page, refreshIndex]);

    const handlePageChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
        setPage(nextPage);
    };

    // Reloads the list from the db, jumping back to the first page so newly added news is visible.
    const handleRefresh = () => {
        setPage(1);
        setRefreshIndex((previousRefreshIndex) => previousRefreshIndex + 1);
    };

    return { newsList, page, totalPages, loading, errorMessage, handlePageChange, handleRefresh };
}

export async function deleteNewsItem(newsId: string): Promise<void> {
    const response = await newsService.deleteNews(newsId);

    if (response && typeof response === 'object' && 'error' in response && response.error) {
        throw new Error(response.error);
    }
}

export default useNewsList;
