import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { bookService, type BookDetails } from '../../api';
import { buildAssetUrl } from '../Admin/Books/use-books';

function useReadBook() {
    const { meta } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<BookDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        if (!meta) {
            return;
        }

        let cancelled = false;

        const loadBook = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await bookService.getBookDetails(meta);

                if (cancelled) return;

                if (bookService.isBookError(response)) {
                    setErrorMessage(response.error);
                    setBook(null);
                } else {
                    setBook(response);
                }
            } catch {
                if (!cancelled) setErrorMessage('Unable to load this book. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void loadBook();

        return () => {
            cancelled = true;
        };
    }, [meta]);

    const handleBack = () => navigate('/read');
    const startReading = () => setIsReading(true);

    const aboutParagraphs = (book?.aboutTheBook ?? '')
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    const footerDetails = book
        ? [
              book.category.join(', '),
              book.readDuration,
              book.pages?.length ? `${book.pages.length} key moments` : '',
          ].filter(Boolean)
        : [];

    return {
        book,
        loading,
        errorMessage,
        coverImageUrl: buildAssetUrl(book?.image?.[0]?.name || ""),
        aboutParagraphs,
        footerDetails,
        handleBack,
        isReading,
        startReading,
    };
}

export default useReadBook;
