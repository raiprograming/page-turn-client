import { useEffect, useState, type ChangeEvent } from 'react';
import { bookService, type Book } from '../../../api';

const PAGE_SIZE = 6;

// Shown only when the API has not yet returned any book, so the list design can still be reviewed.
export const DUMMY_BOOKS: Book[] = [
    {
        _id: 'dummy-1',
        name: 'The Silent Horizon',
        authorName: 'Maya Linwood',
        aboutTheBook:
            'A lone astronomer uncovers a signal hidden in starlight, setting off a journey across continents to decode a message that could change humanity\'s understanding of its place in the universe.',
        categoryRatings: [
            { category: 'Sci-Fi', rating: 5 },
            { category: 'Mystery', rating: 4 },
        ],
        readDuration: '6 hr 20 min',
        image: [],
    },
    {
        _id: 'dummy-2',
        name: 'Embers of the Old Market',
        authorName: 'Rohan Qureshi',
        aboutTheBook:
            'In a bustling bazaar town, a young trader\'s chance discovery of a forgotten ledger reveals a decades-old betrayal that still shapes the fortunes of every family living there today.',
        categoryRatings: [
            { category: 'Drama', rating: 4 },
            { category: 'Historical', rating: 4 },
        ],
        readDuration: '4 hr 45 min',
        image: [],
    },
    {
        _id: 'dummy-3',
        name: 'Paper Boats and Promises',
        authorName: 'Elena Marchetti',
        aboutTheBook:
            'Two childhood friends separated by circumstance reconnect through letters sent in paper boats down a monsoon river, rediscovering a friendship neither thought they could keep.',
        categoryRatings: [{ category: 'Romance', rating: 5 }],
        readDuration: '3 hr 10 min',
        image: [],
    },
];

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
