import { Alert, Box, Button, IconButton, Link as MuiLink, Snackbar, TextField, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import type { ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { object, string, mixed } from 'yup';
import { Form, useForm } from '../../../Form';
import useBookPage, { type PageFormValues } from './use-book-page';
import styles from './book-page.module.css';

export const pageValidationSchema = object({
    title: string().required('Title is required'),
    imageUrl: mixed()
        .nullable()
        .test('is-valid-image', 'Enter a valid url', (value) => {
            if (!value) {
                return true;
            }

            if (value instanceof File) {
                return true;
            }

            return typeof value === 'string' && /^https?:\/\/\S+$/.test(value);
        }),
    summary: string().required('Summary is required'),
    highlight: string().required('Highlight is required'),
});

interface PageFormFieldsProps {
    formId: string;
    onRemovePage: () => void;
}

function PageFormFields({ formId, onRemovePage }: PageFormFieldsProps) {
    const { currentValue, handleChange, setFieldValue, isSubmitting, errorState, touchedState, submitCount } =
        useForm<PageFormValues>(formId);

    // Shows a field's validation message once it has been touched or a submit has been attempted.
    const getFieldError = (field: keyof PageFormValues): string => {
        const hasBeenInteractedWith = Boolean(touchedState[field]) || submitCount > 0;
        const error = errorState[field];

        return hasBeenInteractedWith && typeof error === 'string' ? error : '';
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0] ?? null;

        if (!nextFile) {
            return;
        }

        setFieldValue('imageUrl', nextFile);
    };

    const handleRemoveImage = () => {
        setFieldValue('imageUrl', '');
    };

    const isFile = currentValue.imageUrl instanceof File;
    const hasUrl = typeof currentValue.imageUrl === 'string' && currentValue.imageUrl.length > 0;

    return (
        <Box className={styles.pageFormShell}>
            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-title`}
                    name="title"
                    label="Title"
                    value={currentValue.title}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(getFieldError('title'))}
                    helperText={getFieldError('title')}
                    className={styles.fieldHalf}
                />

                {isFile || hasUrl ? (
                    <Box className={styles.imageFieldRow}>
                        <TextField
                            label="Image"
                            value={isFile ? (currentValue.imageUrl as File).name : (currentValue.imageUrl as string)}
                            fullWidth
                            disabled
                            className={styles.fieldHalf}
                        />
                        {hasUrl && (
                            <MuiLink
                                href={currentValue.imageUrl as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.imageOpenLink}
                            >
                                <OpenInNewIcon fontSize="small" />
                            </MuiLink>
                        )}
                        <IconButton
                            component="label"
                            aria-label="Change image"
                            size="small"
                            className={styles.imageActionButton}
                        >
                            <EditOutlinedIcon fontSize="small" />
                            <input hidden type="file" accept="image/*" onChange={handleImageChange} />
                        </IconButton>
                        <IconButton
                            type="button"
                            aria-label="Remove image"
                            size="small"
                            onClick={handleRemoveImage}
                            className={styles.imageActionButton}
                        >
                            <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <TextField
                        id={`${formId}-image`}
                        label="Add Image"
                        type="file"
                        fullWidth
                        onChange={handleImageChange}
                        slotProps={{
                            htmlInput: { accept: 'image/*' },
                            inputLabel: { shrink: true },
                        }}
                        className={styles.fieldHalf}
                    />
                )}
            </Box>

            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-highlight`}
                    name="highlight"
                    label="Highlight"
                    value={currentValue.highlight}
                    onChange={handleChange}
                    fullWidth
                    error={Boolean(getFieldError('highlight'))}
                    helperText={getFieldError('highlight')}
                    className={styles.fullWidthField}
                />
            </Box>

            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-summary`}
                    name="summary"
                    label="Summary"
                    value={currentValue.summary}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={5}
                    error={Boolean(getFieldError('summary'))}
                    helperText={getFieldError('summary')}
                    className={styles.fullWidthField}
                />
            </Box>

            <Box className={styles.buttonRow}>
                <Button type="submit" variant="contained" className={styles.submitButton} disabled={isSubmitting}>
                    Save page
                </Button>
                <Button type="button" variant="outlined" onClick={onRemovePage} className={styles.removeButton}>
                    Remove page
                </Button>
            </Box>
        </Box>
    );
}


function BookPage() {
    const { id } = useParams<{ id: string }>();
    const {
        book,
        pages,
        loading,
        errorMessage,
        toastMessage,
        toastSeverity,
        isToastOpen,
        closeToast,
        handleAddPage,
        handleRemovePage,
        handleSavePage,
    } = useBookPage(id);

    if (loading) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText}>Loading book...</Typography>
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box className={styles.page}>
                <Typography className={styles.statusText} color="error">
                    {errorMessage}
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={styles.page}>
            {book && (
                <Box className={styles.metaShell}>
                    <Typography variant="h4" className={styles.pageTitle}>
                        {book.name}
                    </Typography>
                    <Typography variant="body1" className={styles.metaAuthor}>
                        by {book.authorName}
                    </Typography>
                </Box>
            )}

            {pages.map((pageEntry) => (
                <Form
                    key={pageEntry.key}
                    id={`book-page-${pageEntry.key}`}
                    validationSchema={pageValidationSchema}
                    initialValue={pageEntry.initialValues}
                    onSubmit={handleSavePage(pageEntry.key)}
                    // onSubmit={test}
                >
                    <PageFormFields formId={`book-page-${pageEntry.key}`} onRemovePage={handleRemovePage(pageEntry.key)} />
                </Form>
            ))}

            <Button
                type="button"
                variant="outlined"
                startIcon={<AddCircleOutlined />}
                onClick={handleAddPage}
                className={styles.addPageButton}
            >
                Add page
            </Button>

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

export default BookPage;
