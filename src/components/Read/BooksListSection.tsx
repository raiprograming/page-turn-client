import { CircularProgress, Typography } from '@mui/material';
import type { Ref } from 'react';
import type { Book } from '../../api';
import BookCard from './BookCard';
import styles from './read.module.css';

interface BooksListSectionProps {
    books: Book[];
    searchValue: string;
    hasMore: boolean;
    loadMoreRef: Ref<HTMLDivElement>;
    loading: boolean;
    errorMessage: string;
}

function BooksListSection({
    books,
    searchValue,
    hasMore,
    loadMoreRef,
    loading,
    errorMessage,
}: BooksListSectionProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Results for "{searchValue}"</h2>

            {loading && books.length === 0 && <Typography className={styles.statusText}>Loading books...</Typography>}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {!loading && !errorMessage && books.length === 0 && (
                <Typography className={styles.statusText}>No books found.</Typography>
            )}

            {books.length > 0 && (
                <>
                    <div className={styles.cardGrid}>
                        {books.map((book) => (
                            <BookCard key={book._id ?? book.name} book={book} />
                        ))}
                    </div>

                    {hasMore && !errorMessage && <div ref={loadMoreRef} className={styles.loadMore} />}
                    {loading && (
                        <div className={styles.loadingMore}>
                            <CircularProgress size={24} className={styles.spinner} />
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default BooksListSection;
