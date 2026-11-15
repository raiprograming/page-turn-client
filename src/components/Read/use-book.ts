import { useCallback, useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent, type UIEvent } from 'react';
import { useSearchParams } from 'react-router';
import { bookService, type Book } from '../../api';

const PAGE_SIZE = 8;
const SEARCH_PARAM = 'search';

interface BooksState {
    books: Book[];
    loading: boolean;
    errorMessage: string;
}

interface SearchResultsState extends BooksState {
    search: string;
    hasMore: boolean;
}

const initialBooksState: BooksState = { books: [], loading: false, errorMessage: '' };

interface LibraryState extends BooksState {
    hasMore: boolean;
}

const initialLibraryState: LibraryState = { ...initialBooksState, hasMore: false };

async function fetchBooks(body: Parameters<typeof bookService.listBooks>[0]): Promise<Book[]> {
    const response = await bookService.listBooks(body);

    if (bookService.isBookError(response)) {
        throw new Error(response.error);
    }

    return response;
}

function useBook() {
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue = searchParams.get(SEARCH_PARAM)?.trim() ?? '';

    const [searchInput, setSearchInput] = useState(searchValue);
    // Page is tied to the search it belongs to, so a new search always starts from page 1.
    const [pageState, setPageState] = useState({ search: searchValue, page: 1 });
    const [activeIndex, setActiveIndex] = useState(0);
    const [booksOfTheDay, setBooksOfTheDay] = useState<BooksState>(initialBooksState);
    const [resultsState, setResultsState] = useState<SearchResultsState>({
        ...initialBooksState,
        search: '',
        hasMore: false,
    });
    const observerRef = useRef<IntersectionObserver | null>(null);
    const libraryObserverRef = useRef<IntersectionObserver | null>(null);
    const [libraryPage, setLibraryPage] = useState(1);
    const [libraryState, setLibraryState] = useState<LibraryState>(initialLibraryState);
    const page = pageState.search === searchValue ? pageState.page : 1;
    const isCurrentSearch = resultsState.search === searchValue;
    const searchResults = {
        books: isCurrentSearch ? resultsState.books : [],
        loading: !isCurrentSearch || resultsState.loading,
        errorMessage: isCurrentSearch ? resultsState.errorMessage : '',
    };
    const hasMore = isCurrentSearch && resultsState.hasMore;

    useEffect(() => {
        setSearchInput(searchValue);
    }, [searchValue]);

    useEffect(() => {
        if (searchValue) {
            return;
        }

        let isActive = true;

        const load = async () => {
            setBooksOfTheDay({ books: [], loading: true, errorMessage: '' });

            try {
                const books = await fetchBooks({ search: '', category: '' });

                if (isActive) {
                    setBooksOfTheDay({ books, loading: false, errorMessage: '' });
                }
            } catch (error: unknown) {
                if (isActive) {
                    setBooksOfTheDay({
                        books: [],
                        loading: false,
                        errorMessage: error instanceof Error ? error.message : 'Failed to load books.',
                    });
                }
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [searchValue]);

    useEffect(() => {
        if (!searchValue) {
            return;
        }

        let isActive = true;

        const load = async () => {
            setResultsState((previous) => ({
                books: previous.search === searchValue && page > 1 ? previous.books : [],
                search: searchValue,
                hasMore: false,
                loading: true,
                errorMessage: '',
            }));

            try {
                const books = await fetchBooks({ search: searchValue, page, limit: PAGE_SIZE });

                if (isActive) {
                    setResultsState((previous) => ({
                        books: page > 1 ? [...previous.books, ...books] : books,
                        search: searchValue,
                        hasMore: books.length === PAGE_SIZE,
                        loading: false,
                        errorMessage: '',
                    }));
                }
            } catch (error: unknown) {
                if (isActive) {
                    setResultsState((previous) => ({
                        books: page > 1 ? previous.books : [],
                        search: searchValue,
                        hasMore: false,
                        loading: false,
                        errorMessage: error instanceof Error ? error.message : 'Failed to load books.',
                    }));
                }
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [searchValue, page]);

    // Explore Library: the unfiltered list, shown only without a search. Reset when a search starts.
    useEffect(() => {
        if (searchValue) {
            setLibraryPage(1);
            setLibraryState(initialLibraryState);

            return;
        }

        let isActive = true;

        const load = async () => {
            setLibraryState((previous) => ({
                books: libraryPage > 1 ? previous.books : [],
                hasMore: false,
                loading: true,
                errorMessage: '',
            }));

            try {
                const books = await fetchBooks({ page: libraryPage, limit: PAGE_SIZE });

                if (isActive) {
                    setLibraryState((previous) => ({
                        books: libraryPage > 1 ? [...previous.books, ...books] : books,
                        hasMore: books.length === PAGE_SIZE,
                        loading: false,
                        errorMessage: '',
                    }));
                }
            } catch (error: unknown) {
                if (isActive) {
                    setLibraryState((previous) => ({
                        books: libraryPage > 1 ? previous.books : [],
                        hasMore: false,
                        loading: false,
                        errorMessage: error instanceof Error ? error.message : 'Failed to load books.',
                    }));
                }
            }
        };

        void load();

        return () => {
            isActive = false;
        };
    }, [searchValue, libraryPage]);

    const loadMoreLibraryRef = useCallback(
        (node: HTMLDivElement | null) => {
            libraryObserverRef.current?.disconnect();
            libraryObserverRef.current = null;

            if (!node || !libraryState.hasMore || libraryState.loading) {
                return;
            }

            libraryObserverRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setLibraryPage((previousPage) => previousPage + 1);
                    }
                },
                { rootMargin: '300px' },
            );
            libraryObserverRef.current.observe(node);
        },
        [libraryState.hasMore, libraryState.loading],
    );
    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleSearchSubmit = () => {
        const trimmedValue = searchInput.trim();

        setSearchParams(trimmedValue ? { [SEARCH_PARAM]: trimmedValue } : {});
    };

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearchSubmit();
        }
    };

    // Callback ref for a sentinel element below the list; loads the next page as it nears the viewport.
    const loadMoreRef = useCallback(
        (node: HTMLDivElement | null) => {
            observerRef.current?.disconnect();
            observerRef.current = null;

            if (!node || !hasMore || resultsState.loading) {
                return;
            }

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setPageState({ search: searchValue, page: page + 1 });
                    }
                },
                { rootMargin: '300px' },
            );
            observerRef.current.observe(node);
        },
        [hasMore, resultsState.loading, searchValue, page],
    );

    const handleCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
        const container = event.currentTarget;
        const firstCard = container.firstElementChild as HTMLElement | null;

        if (!firstCard) {
            return;
        }

        const cardStep = firstCard.offsetWidth + 16;

        setActiveIndex(Math.round(container.scrollLeft / cardStep));
    };

    return {
        searchValue,
        searchInput,
        handleSearchInputChange,
        handleSearchSubmit,
        handleSearchKeyDown,
        booksOfTheDay,
        activeIndex,
        handleCarouselScroll,
        searchResults,
        hasMore,
        loadMoreRef,
        library: libraryState,
        loadMoreLibraryRef,
    };
}

export default useBook;
