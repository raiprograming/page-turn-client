import { Typography } from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { UIEvent } from 'react';
import type { Book } from '../../api';
import { buildAssetUrl } from '../Admin/Books/use-books';
import styles from './read.module.css';
import { useBooksOfTheDay } from './use-books-of-the-day';

interface BooksOfTheDayProps {
    books: Book[];
    loading: boolean;
    errorMessage: string;
    activeIndex: number;
    onScroll: (event: UIEvent<HTMLDivElement>) => void;
}

function BooksOfTheDay({ books, loading, errorMessage, activeIndex, onScroll }: BooksOfTheDayProps) {
    const { handleOpenBook } = useBooksOfTheDay();

    return (
        <section className={styles.section}>
            <p className={styles.eyebrow}>PageTurn Picks &nbsp;·&nbsp; Today</p>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Books of the Day</h2>
                {books.length > 0 && <span className={styles.sectionCount}>{books.length} books</span>}
            </div>

            {loading && <Typography className={styles.statusText}>Loading books...</Typography>}
            {!loading && errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {!loading && !errorMessage && books.length === 0 && (
                <Typography className={styles.statusText}>No books found.</Typography>
            )}

            {books.length > 0 && (
                <>
                    <div className={styles.carousel} onScroll={onScroll}>
                        {books.map((book) => {
                            const coverImageUrl = buildAssetUrl(book.image?.[0]?.name);

                            return (
                                <article
                                    key={book._id ?? book.name}
                                    className={styles.dayCard}
                                    role="button"
                                    tabIndex={0}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleOpenBook(book._id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') handleOpenBook(book._id);
                                    }}
                                >
                                    <div className={styles.dayCover}>
                                        {coverImageUrl ? (
                                            <img src={coverImageUrl} alt={book.name} className={styles.coverImage} />
                                        ) : (
                                            <MenuBookOutlinedIcon className={styles.coverPlaceholderIcon} />
                                        )}
                                    </div>
                                    <h3 className={styles.dayTitle}>{book.name}</h3>
                                    <p className={styles.dayAuthor}>{book.authorName}</p>
                                    <p className={styles.dayMeta}>
                                        {book.readDuration}
                                        {book.category[0] && ` · ${book.category[0]}`}
                                    </p>
                                </article>
                            );
                        })}
                    </div>

                    <div className={styles.carouselFooter}>
                        <div className={styles.dots}>
                            {books.map((book, index) => (
                                <span
                                    key={book._id ?? book.name}
                                    className={index === activeIndex ? styles.dotActive : styles.dot}
                                />
                            ))}
                        </div>
                        <span className={styles.swipeHint}>
                            Swipe to explore <ArrowForwardIcon fontSize="inherit" />
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}

export default BooksOfTheDay;
