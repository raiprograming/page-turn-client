import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Pagination,
    Typography,
} from '@mui/material';
import { useState, type ChangeEvent } from 'react';
import type { NewsListItem } from '../../../api';
import { Form } from '../../Form';
import { NewsFormFields, newsValidationSchema } from './News';
import { mapNewsListItemToFormValues } from './use-news';
import { deleteNewsItem } from './use-news-list';
import styles from './news-list.module.css';

interface NewsListProps {
    newsList: NewsListItem[];
    page: number;
    totalPages: number;
    loading: boolean;
    errorMessage: string;
    handlePageChange: (event: ChangeEvent<unknown>, nextPage: number) => void;
    handleRefresh: () => void;
}

function NewsList({ newsList, page, totalPages, loading, errorMessage, handlePageChange, handleRefresh }: NewsListProps) {
    const [selectedNews, setSelectedNews] = useState<NewsListItem | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const openDeleteDialog = (newsItem: NewsListItem) => {
        setSelectedNews(newsItem);
        setDeleteError('');
        setIsDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        if (!isDeleting) {
            setIsDeleteDialogOpen(false);
            setSelectedNews(null);
            setDeleteError('');
        }
    };

    const confirmDelete = async () => {
        const newsId = selectedNews?._id;

        if (!newsId) {
            setDeleteError('News id is missing.');
            return;
        }

        setIsDeleting(true);
        setDeleteError('');

        try {
            await deleteNewsItem(newsId);
            setIsDeleteDialogOpen(false);
            setSelectedNews(null);
            handleRefresh();
        } catch (error: unknown) {
            setDeleteError(error instanceof Error ? error.message : 'Failed to delete news.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Box className={styles.listSection}>
            <Typography variant="h5" className={styles.listTitle}>
                Existing News
            </Typography>

            {loading && (
                <Typography variant="body2" className={styles.statusText}>
                    Loading news...
                </Typography>
            )}

            {!loading && errorMessage && (
                <Typography variant="body2" color="error">
                    {errorMessage}
                </Typography>
            )}

            {!loading && !errorMessage && newsList.length === 0 && (
                <Typography variant="body2" className={styles.statusText}>
                    No news found.
                </Typography>
            )}

            {!loading &&
                !errorMessage &&
                newsList.map((newsItem) => {
                    const formId = `news-list-item-${newsItem._id ?? newsItem.title}`;

                    return (
                        <Box key={formId} className={styles.listItem}>
                            <Button
                                type="button"
                                size="small"
                                variant="text"
                                className={styles.deleteButton}
                                onClick={() => openDeleteDialog(newsItem)}
                                disabled={!newsItem._id}
                            >
                                Delete
                            </Button>
                            <Form
                                id={formId}
                                validationSchema={newsValidationSchema}
                                initialValue={mapNewsListItemToFormValues(newsItem)}
                                onSubmit={() => {}}
                            >
                                <NewsFormFields formId={formId} disabled />
                            </Form>
                        </Box>
                    );
                })}

            {!loading && !errorMessage && newsList.length > 0 && (
                <Box className={styles.paginationWrapper}>
                    <Pagination page={page} count={totalPages} onChange={handlePageChange} color="primary" />
                </Box>
            )}

            <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} aria-labelledby="delete-news-title">
                <DialogTitle id="delete-news-title">Delete news</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedNews ? `Delete "${selectedNews.title}"? This action cannot be undone.` : 'Delete this news item?'}
                    </DialogContentText>
                    {deleteError && (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {deleteError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} disabled={isDeleting} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} disabled={isDeleting} className={styles.deleteDialogButton}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default NewsList;
