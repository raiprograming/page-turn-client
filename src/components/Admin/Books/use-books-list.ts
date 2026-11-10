import { useEffect, useState, type ChangeEvent } from 'react';
import { bookService, type Book } from '../../../api';

const PAGE_SIZE = 6;


function useBooksList() {
    const [booksList, setBooksList] = useState<Book[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        let isActive = true;

        const loadBooksList = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await bookService.listBooks({ page, limit: PAGE_SIZE });

                if (!isActive) {
                    return;
                }

                if (bookService.isBookError(response)) {
                    throw new Error(response.error);
                }

                setBooksList(response);
                setTotalPages((previousTotalPages) =>
                    response.length === PAGE_SIZE ? Math.max(previousTotalPages, page + 1) : page,
                );
            } catch (error: unknown) {
                if (isActive) {
                    setBooksList([]);
                    setErrorMessage(error instanceof Error ? error.message : 'Failed to load books.');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadBooksList();

        return () => {
            isActive = false;
        };
    }, [page, refreshIndex]);

    const handlePageChange = (_event: ChangeEvent<unknown>, nextPage: number) => {
        setPage(nextPage);
    };

    // Reloads the list from the db, jumping back to the first page so newly added books are visible.
    const handleRefresh = () => {
        setPage(1);
        setRefreshIndex((previousRefreshIndex) => previousRefreshIndex + 1);
    };

    return {
        booksList,
        page,
        totalPages,
        loading,
        errorMessage,
        handlePageChange,
        handleRefresh,
    };
}

export default useBooksList;
