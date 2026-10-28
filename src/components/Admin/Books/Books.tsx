import { Alert, Box, Button, Divider, IconButton, Rating, Snackbar, TextField, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { array, number, object, string, mixed } from 'yup';
import { Form, useForm } from '../../Form';
import Option from '../../Option/option';
import BooksList from "./BooksList";
import useBooks, { type BookFormValues } from "./use-books"
import useBooksList from "./use-books-list"
import styles from './books.module.css';
import { AddCircleOutlined, RemoveCircleOutlined } from '@mui/icons-material';
import type { BookCategoryRating, HyperParameterOption } from '../../../api';

export const booksValidationSchema = object({
    name: string().required('Name is required'),
    authorName: string().required('Author name is required'),
    aboutTheBook: string().required('About the book is required'),
    category: mixed<HyperParameterOption>().nullable().required('Category is required'),
    readDuration: string().required('Read duration is required'),
    image: mixed<File>().nullable().required('Image is required'),
    imageName: string().nullable(),
    categoryRatings: array()
        .of(
            object({
                category: string().required('Category is required'),
                rating: number().min(1, 'Rating is required').max(5).required('Rating is required'),
            }),
        )
        .min(1, 'Add at least one category rating'),
});

const initialValues: BookFormValues = {
    name: '',
    authorName: '',
    aboutTheBook: '',
    category: null,
    categoryRatings: [{ category: '', rating: 0 }],
    readDuration: '',
    image: null,
    imageName: '',
};

interface BooksFormFieldsProps {
    formId: string;
}

function BooksFormFields({ formId }: BooksFormFieldsProps) {
    const { currentValue, handleChange, setFieldValue, isSubmitting, errorState, touchedState, submitCount } =
        useForm<BookFormValues>(formId);

    // Shows a field's validation message once it has been touched or a submit has been attempted.
    const getFieldError = (field: keyof BookFormValues): string => {
        const hasBeenInteractedWith = Boolean(touchedState[field]) || submitCount > 0;
        const error = errorState[field];

        return hasBeenInteractedWith && typeof error === 'string' ? error : '';
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0] ?? null;
        setFieldValue('image', nextFile);
        setFieldValue('imageName', nextFile ? nextFile.name : '');
    };

    const handleCategoryChange = (index: number, category: string) => {
        const nextCategoryRatings = currentValue.categoryRatings.map((categoryRating: BookCategoryRating, currentIndex: number) =>
            currentIndex === index ? { ...categoryRating, category } : categoryRating,
        );
        setFieldValue('categoryRatings', nextCategoryRatings);
    };

    // Option expects a {value, name} pair, so wrap/unwrap the plain string stored on the row.
    const getCategoryOptionValue = (category: string) => (category ? { value: category, name: category } : null);

    const handleRatingChange = (index: number, rating: number) => {
        const nextCategoryRatings = currentValue.categoryRatings.map((categoryRating: BookCategoryRating, currentIndex: number) =>
            currentIndex === index ? { ...categoryRating, rating } : categoryRating,
        );
        setFieldValue('categoryRatings', nextCategoryRatings);
    };

    const handleAddCategoryRating = () => {
        setFieldValue('categoryRatings', [...currentValue.categoryRatings, { category: '', rating: 0 }]);
    };

    const handleRemoveCategoryRating = (index: number) => {
        setFieldValue(
            'categoryRatings',
            currentValue.categoryRatings.filter((_categoryRating: BookCategoryRating, currentIndex: number) => currentIndex !== index),
        );
    };

    return (
        <Box className={styles.formShell}>
            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-name`}
                    name="name"
                    label="Name"
                    value={currentValue.name}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(getFieldError('name'))}
                    helperText={getFieldError('name')}
                    className={styles.fieldHalf}
                />

                <TextField
                    id={`${formId}-authorName`}
                    name="authorName"
                    label="Author Name"
                    value={currentValue.authorName}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(getFieldError('authorName'))}
                    helperText={getFieldError('authorName')}
                    className={styles.fieldHalf}
                />
            </Box>

            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-image`}
                    name="image"
                    label="Image"
                    type="file"
                    fullWidth
                    onChange={handleImageChange}
                    error={Boolean(getFieldError('image'))}
                    helperText={getFieldError('image')}
                    slotProps={{
                        htmlInput: { accept: 'image/*' },
                        inputLabel: { shrink: true },
                    }}
                    className={styles.fieldHalf}
                />

                <TextField
                    id={`${formId}-readDuration`}
                    name="readDuration"
                    label="Read Duration"
                    value={currentValue.readDuration}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(getFieldError('readDuration'))}
                    helperText={getFieldError('readDuration')}
                    className={styles.fieldHalf}
                    placeholder="e.g. 5 hr 30 min"
                />

                <Option
                    name="category"
                    entity="book"
                    type="category"
                    label="Category"
                    value={currentValue.category}
                    setFieldValue={setFieldValue}
                    error={Boolean(getFieldError('category'))}
                    helperText={getFieldError('category')}
                    className={styles.fieldHalf}
                />
            </Box>

            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-aboutTheBook`}
                    name="aboutTheBook"
                    label="About the Book"
                    value={currentValue.aboutTheBook}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={4}
                    error={Boolean(getFieldError('aboutTheBook'))}
                    helperText={getFieldError('aboutTheBook')}
                    className={styles.fullWidthField}
                />
            </Box>

            <Box className={styles.categoryRatingsSection}>
                <Typography variant="subtitle2" className={styles.categoryRatingsLabel}>
                    Category Ratings
                </Typography>

                {currentValue.categoryRatings.map((categoryRating: BookCategoryRating, index: number) => (
                    <Box key={`${formId}-category-rating-${index}`} className={styles.categoryRatingRow}>
                        <Option
                            name={`categoryRatings.${index}.category`}
                            entity="book"
                            type="category"
                            label="Category"
                            value={getCategoryOptionValue(categoryRating.category)}
                            onChange={(option) => handleCategoryChange(index, option?.value ?? '')}
                            className={styles.categoryRatingField}
                        />
                        <Rating
                            value={categoryRating.rating}
                            onChange={(_event, nextValue) => handleRatingChange(index, nextValue ?? 0)}
                        />
                        <IconButton
                            type="button"
                            aria-label="Remove category rating"
                            onClick={() => handleRemoveCategoryRating(index)}
                            disabled={currentValue.categoryRatings.length === 1}
                            size="small"
                        >
                            <RemoveCircleOutlined fontSize="small" />
                        </IconButton>
                    </Box>
                ))}

                <Button
                    type="button"
                    size="small"
                    startIcon={<AddCircleOutlined />}
                    onClick={handleAddCategoryRating}
                    className={styles.addCategoryRatingButton}
                >
                    Add category rating
                </Button>
            </Box>

            <Divider />
            <Button type="submit" variant="contained" className={styles.submitButton} disabled={isSubmitting}>
                Save book
            </Button>
        </Box>
    );
}

function Books() {
    const { booksList, page, totalPages, loading, errorMessage, handlePageChange, handleRefresh } = useBooksList();
    const { handleSubmitBook, toastMessage, toastSeverity, isToastOpen, closeToast } = useBooks(handleRefresh);

    return (
        <Box className={styles.page}>
            <Typography variant="h4" className={styles.pageTitle}>
                Book Management
            </Typography>
            <Typography variant="body2" className={styles.pageSubtitle}>
                Add new books and review the ones already published.
            </Typography>

            <Form
                id="books-form"
                validationSchema={booksValidationSchema}
                initialValue={initialValues}
                onSubmit={handleSubmitBook}
            >
                <BooksFormFields formId="books-form" />
            </Form>

            <BooksList
                booksList={booksList}
                page={page}
                totalPages={totalPages}
                loading={loading}
                errorMessage={errorMessage}
                handlePageChange={handlePageChange}
            />

            <Snackbar
                open={isToastOpen}
                autoHideDuration={4000}
                onClose={closeToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={closeToast} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Books;
