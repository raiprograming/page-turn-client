import { Box, Card, CardContent, Chip, Pagination, Rating, Typography } from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router';
import type { Book } from '../../../api';
import styles from './books.module.css';

interface BooksListProps {
    booksList: Book[];
    page: number;
    totalPages: number;
    loading: boolean;
    errorMessage: string;
    handlePageChange: (event: ChangeEvent<unknown>, nextPage: number) => void;
}

function BooksList({ booksList, page, totalPages, loading, errorMessage, handlePageChange }: BooksListProps) {
    return (
        <Box className={styles.listSection}>
            <Typography variant="h5" className={styles.listTitle}>
                Existing Books
            </Typography>

            {loading && (
                <Typography variant="body2" className={styles.statusText}>
                    Loading books...
                </Typography>
            )}

            {!loading && errorMessage && (
                <Typography variant="body2" color="error">
                    {errorMessage}
                </Typography>
            )}

            {!loading && !errorMessage && booksList.length === 0 && (
                <Typography variant="body2" className={styles.statusText}>
                    No books found.
                </Typography>
            )}

            {!loading && !errorMessage && booksList.length > 0 && (
                <Box className={styles.cardGrid}>
                    {booksList.map((book) => {
                        const coverImageUrl = book.image?.[0]?.url;

                        return (
                            <Card key={book._id ?? book.name} className={styles.bookCard}>
                                <Link to={`/admin/books/${book._id ?? ''}`} className={styles.coverWrapper}>
                                    {coverImageUrl ? (
                                        <img src={coverImageUrl} alt={book.name} className={styles.coverImage} />
                                    ) : (
                                        <MenuBookOutlinedIcon className={styles.coverPlaceholderIcon} />
                                    )}
                                </Link>

                                <CardContent className={styles.cardContent}>
                                    <Link to={`/admin/books/${book._id ?? ''}`} className={styles.bookTitleLink}>
                                        <Typography className={styles.bookTitle}>{book.name}</Typography>
                                    </Link>
                                    <Typography className={styles.bookAuthor}>by {book.authorName}</Typography>

                                    <Typography className={styles.bookAbout}>{book.aboutTheBook}</Typography>

                                    <Box className={styles.ratingsRow}>
                                        {book.categoryRatings.map((categoryRating) => (
                                            <Box key={categoryRating.category} className={styles.ratingItem}>
                                                <Chip
                                                    label={categoryRating.category}
                                                    size="small"
                                                    className={styles.categoryChip}
                                                />
                                                <Rating value={categoryRating.rating} readOnly size="small" />
                                            </Box>
                                        ))}
                                    </Box>

                                    <Box className={styles.readDurationRow}>
                                        <CategoryOutlinedIcon fontSize="small" className={styles.readDurationIcon} />
                                        <Typography className={styles.readDurationText}>{book.category}</Typography>
                                        <ScheduleOutlinedIcon fontSize="small" className={styles.readDurationIcon} />
                                        <Typography className={styles.readDurationText}>{book.readDuration}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            )}

            {!loading && !errorMessage && booksList.length > 0 && (
                <Box className={styles.paginationWrapper}>
                    <Pagination page={page} count={totalPages} onChange={handlePageChange} color="primary" />
                </Box>
            )}
        </Box>
    );
}

export default BooksList;
