import { Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import type { Book } from '../../api';
import { buildAssetUrl } from '../Admin/Books/use-books';
import styles from './read.module.css';
import { useBookCard } from './use-book-card';

interface BookCardProps {
    book: Book;
}

function BookCard({ book }: BookCardProps) {
    const coverImageUrl = buildAssetUrl(book.image?.[0]?.name);

    const { handleOpenBook } = useBookCard(book._id);

    return (
        <Card className={styles.bookCard}>
            <CardActionArea onClick={handleOpenBook}>
            <div className={styles.coverWrapper}>
                {coverImageUrl ? (
                    <img src={coverImageUrl} alt={book.name} className={styles.coverImage} />
                ) : (
                    <MenuBookOutlinedIcon className={styles.coverPlaceholderIcon} />
                )}
            </div>

            <CardContent className={styles.cardContent}>
                <Typography className={styles.bookTitle}>{book.name}</Typography>
                <Typography className={styles.bookAuthor}>by {book.authorName}</Typography>

                <div className={styles.metaRow}>
                    <CategoryOutlinedIcon fontSize="small" className={styles.metaIcon} />
                    {book.category.map((cat) => (
                        <Chip key={cat} label={cat} size="small" className={styles.categoryChip} />
                    ))}
                </div>
                <div className={styles.metaRow}>
                    <ScheduleOutlinedIcon fontSize="small" className={styles.metaIcon} />
                    <Typography className={styles.metaText}>{book.readDuration}</Typography>
                </div>
            </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default BookCard;
