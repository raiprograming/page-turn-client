import { Button, CircularProgress, IconButton, Rating, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import readStyles from '../Read/read.module.css';
import styles from './ReadBook.module.css';
import ReadingView from './ReadingView';
import useReadBook from './use-read-book';

function ReadBook() {
    const {
        book,
        loading,
        errorMessage,
        coverImageUrl,
        aboutParagraphs,
        footerDetails,
        handleBack,
        isReading,
        startReading,
    } = useReadBook();
    const showReadingView = isReading && book;

    return (
        <div className={`${readStyles.page} ${styles.page} ${showReadingView ? styles.readingPage : ''}`}>
            {!showReadingView && (
                <div className={styles.header}>
                    <IconButton aria-label="Back to Read" size="small" onClick={handleBack} className={styles.backButton}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <header>
                        <h1 className={readStyles.pageTitle}>Readers Room</h1>
                        <p className={readStyles.pageSubtitle}>Great books. Less time. More understanding.</p>
                    </header>
                </div>
            )}

            {loading && <CircularProgress size={28} sx={{ color: 'var(--primary-color)', alignSelf: 'center', mt: 4 }} />}
            {!loading && errorMessage && <Typography color="error">{errorMessage}</Typography>}

            {!loading && showReadingView && <ReadingView pages={book.pages ?? []} />}

            {!loading && book && !showReadingView && (
                <>
                    <div className={styles.content}>
                        {coverImageUrl && <img src={coverImageUrl} alt={book.name} className={styles.cover} />}
                        <div>
                            <h2 className={styles.bookTitle}>{book.name}</h2>
                            <p className={styles.author}>{book.authorName}</p>
                        </div>

                        <section className={styles.about}>
                            <p className={styles.sectionLabel}>About the book</p>
                            {aboutParagraphs.map((paragraph) => (
                                <p key={paragraph} className={styles.aboutText}>
                                    {paragraph}
                                </p>
                            ))}
                        </section>

                        {book.categoryRatings.length > 0 && (
                            <section className={styles.ratings}>
                                {book.categoryRatings.map(({ category, rating }) => (
                                    <div key={category} className={styles.ratingRow}>
                                        <span className={styles.ratingLabel}>{category}</span>
                                        <Rating
                                            value={rating}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                            className={styles.stars}
                                            aria-label={`${category} rating`}
                                        />
                                    </div>
                                ))}
                                <p className={styles.ratingNote}>PageTurn editorial rating</p>
                            </section>
                        )}

                        <p className={styles.footerDetails}>{footerDetails.join('  ·  ')}</p>
                    </div>

                    <div className={styles.ctaBar}>
                        <Button className={styles.ctaButton} endIcon={<ArrowForwardIcon />} onClick={startReading}>
                            Start Your Journey
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ReadBook;