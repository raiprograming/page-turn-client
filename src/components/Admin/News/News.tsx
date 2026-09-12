import { Alert, Box, Button, Divider, Link, Snackbar, TextField, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { object, string, mixed } from 'yup';
import type { HyperParameterOption } from '../../../api';
import { Form, useForm } from '../../Form';
import Option from '../../Option/option';
import NewsList from './NewsList';
import useNews, { buildAssetUrl, type NewsFormValues } from './use-news';
import useNewsList from './use-news-list';
import styles from './news.module.css';

export const newsValidationSchema = object({
    title: string().required('Title is required'),
    image: mixed<File>().nullable().required('Image is required'),
    imageName: string().nullable(),
    category: mixed<HyperParameterOption>().nullable().required('Category is required'),
    criticality: mixed<HyperParameterOption>().nullable().required('Criticality is required'),
    audience: mixed<HyperParameterOption>().nullable().required('Audience is required'),
    audienceDescription: string().nullable(),
    readDuration: string().required('Read duration is required'),
    whyItMatters: string().required('Why it Matters is required'),
    summary: string().required('Summary is required'),
});

const initialValues: NewsFormValues = {
    title: '',
    image: null,
    imageName: '',
    category: null,
    criticality: null,
    audience: null,
    audienceDescription: '',
    readDuration: '',
    whyItMatters: '',
    summary: '',
};

interface NewsFormFieldsProps {
    formId: string;
    disabled?: boolean;
}

export function NewsFormFields({ formId, disabled = false }: NewsFormFieldsProps) {
    const { currentValue, handleChange, setFieldValue, isSubmitting, errorState, touchedState, submitCount } =
        useForm<NewsFormValues>(formId);

    // Shows a field's validation message once it has been touched or a submit has been attempted.
    const getFieldError = (field: keyof NewsFormValues): string => {
        const hasBeenInteractedWith = Boolean(touchedState[field]) || submitCount > 0;
        const error = errorState[field];

        return hasBeenInteractedWith && typeof error === 'string' ? error : '';
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0] ?? null;
        setFieldValue('image', nextFile);
        setFieldValue('imageName', nextFile ? nextFile.name : '');
    };

    return (
        <Box className={styles.formShell}>
            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-title`}
                    name="title"
                    label="Title"
                    value={currentValue.title}
                    onChange={handleChange}
                    fullWidth
                    disabled={disabled}
                    error={Boolean(getFieldError('title'))}
                    helperText={disabled ? undefined : getFieldError('title')}
                    className={styles.titleField}
                />
            </Box>

            <Box className={styles.grid}>
                {disabled ? (
                    <Box className={styles.imageField}>
                        <Typography variant="caption" className={styles.imageLinkLabel}>
                            Image
                        </Typography>
                        <Box className={styles.imageLinkBox}>
                            {currentValue.imageName ? (
                                <Link
                                    href={buildAssetUrl(currentValue.imageName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                    className={styles.imageLinkText}
                                >
                                    {currentValue.imageName}
                                </Link>
                            ) : (
                                <Typography variant="body2" className={styles.imageLinkPlaceholder}>
                                    No image
                                </Typography>
                            )}
                        </Box>
                    </Box>
                ) : (
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
                        className={styles.imageField}
                    />
                )}

                <Option
                    name="category"
                    entity="news"
                    type="category"
                    label="Category"
                    value={currentValue.category}
                    setFieldValue={setFieldValue}
                    disabled={disabled}
                    error={Boolean(getFieldError('category'))}
                    helperText={getFieldError('category')}
                    className={styles.optionField}
                />

                <Option
                    name="criticality"
                    entity="news"
                    type="criticality"
                    label="Criticality"
                    value={currentValue.criticality}
                    setFieldValue={setFieldValue}
                    disabled={disabled}
                    error={Boolean(getFieldError('criticality'))}
                    helperText={getFieldError('criticality')}
                    className={styles.optionField}
                />
            </Box>

            <Box className={styles.grid}>
                <Option
                    name="audience"
                    entity="news"
                    type="audience"
                    label="Audience"
                    value={currentValue.audience}
                    setFieldValue={setFieldValue}
                    disabled={disabled}
                    error={Boolean(getFieldError('audience'))}
                    helperText={getFieldError('audience')}
                    className={styles.optionField}
                />

                <TextField
                    id={`${formId}-readDuration`}
                    name="readDuration"
                    label="Read Duration"
                    value={currentValue.readDuration}
                    onChange={handleChange}
                    fullWidth
                    disabled={disabled}
                    error={Boolean(getFieldError('readDuration'))}
                    helperText={disabled ? undefined : getFieldError('readDuration')}
                    className={styles.optionField}
                    placeholder="e.g. 5 min"
                />

                <TextField
                    id={`${formId}-audienceDescription`}
                    name="audienceDescription"
                    label="Audience Description"
                    value={currentValue.audienceDescription}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    disabled={disabled}
                    className={styles.fullWidthField}
                />
            </Box>

            <Box className={styles.grid}>
                <TextField
                    id={`${formId}-whyItMatters`}
                    name="whyItMatters"
                    label="Why it Matters"
                    value={currentValue.whyItMatters}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    minRows={3}
                    disabled={disabled}
                    error={Boolean(getFieldError('whyItMatters'))}
                    helperText={disabled ? undefined : getFieldError('whyItMatters')}
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
                    disabled={disabled}
                    error={Boolean(getFieldError('summary'))}
                    helperText={disabled ? undefined : getFieldError('summary')}
                    className={styles.fullWidthField}
                />
            </Box>

            {!disabled && (
                <>
                    <Divider />
                    <Button type="submit" variant="contained" className={styles.submitButton} disabled={isSubmitting}>
                        Save news
                    </Button>
                </>
            )}

        </Box>
    );
}

function News() {
    const { newsList, page, totalPages, loading, errorMessage, handlePageChange, handleRefresh } = useNewsList();
    const { handleSubmitNews, toastMessage, toastSeverity, isToastOpen, closeToast } = useNews(handleRefresh);

    return (
        <Box className={styles.page}>
            <Typography variant="h4" className={styles.pageTitle}>
                News Management
            </Typography>
            <Typography variant="body2" className={styles.pageSubtitle}>
                Create and organize news content with structured metadata.
            </Typography>

            <Form
                id="news-form"
                validationSchema={newsValidationSchema}
                initialValue={initialValues}
                onSubmit={handleSubmitNews}
            >
                <NewsFormFields formId="news-form" />
            </Form>

            <NewsList
                newsList={newsList}
                page={page}
                totalPages={totalPages}
                loading={loading}
                errorMessage={errorMessage}
                handlePageChange={handlePageChange}
                handleRefresh={handleRefresh}
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

export default News;
