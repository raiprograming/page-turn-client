import { useEffect, useState } from 'react';
import type { FormikHelpers } from 'formik';
import { ASSET_ENDPOINTS, assetService, bookService, type Book, type BookDetails, type BookPage } from '../../../../api';
import { API_BASE_URL } from '../../../../api/config';

export interface PageFormValues {
    title: string;
    // Either a cloud asset url (string) or a locally picked file pending upload.
    imageUrl: string | File;
    summary: string;
    highlight: string;
}

export interface PageEntry {
    key: string;
    pageId?: string;
    initialValues: PageFormValues;
}

export const emptyPageValues: PageFormValues = {
    title: '',
    imageUrl: '',
    summary: '',
    highlight: '',
};

function generateKey(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `page-${Date.now()}-${Math.random()}`;
}

function mapBookPageToFormValues(bookPage: BookPage): PageFormValues {
    return {
        title: bookPage.title,
        imageUrl: bookPage.image?.[0]?.url ?? '',
        summary: bookPage.summary,
        highlight: bookPage.highlight,
    };
}

async function readFileAsBase64(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(typeof reader.result === 'string' ? reader.result : '');
        };

        reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`));
        };

        reader.readAsDataURL(file);
    });
}

// Builds the API url that serves an uploaded asset by its file name.
function buildAssetUrl(filename: string): string {
    const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');

    return `${baseUrl}${ASSET_ENDPOINTS.url}?filename=${encodeURIComponent(filename)}`;
}

function useBookPage(bookId: string | undefined) {
    const [book, setBook] = useState<Book | null>(null);
    const [pages, setPages] = useState<PageEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
    const [isToastOpen, setIsToastOpen] = useState(false);

    useEffect(() => {
        if (!bookId) {
            setErrorMessage('Book id is missing.');
            return;
        }

        let isActive = true;

        const loadBookDetails = async () => {
            setLoading(true);
            setErrorMessage('');

            try {
                const response = await bookService.getBookDetails(bookId);

                if (!isActive) {
                    return;
                }

                if (bookService.isBookError(response)) {
                    throw new Error(response.error);
                }

                const { pages: bookPages, ...bookMeta } = response as BookDetails;

                setBook(bookMeta);
                setPages(
                    bookPages.map((bookPage) => ({
                        key: bookPage._id,
                        pageId: bookPage._id,
                        initialValues: mapBookPageToFormValues(bookPage),
                    })),
                );
            } catch (error: unknown) {
                if (isActive) {
                    setErrorMessage(error instanceof Error ? error.message : 'Failed to load book.');
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        void loadBookDetails();

        return () => {
            isActive = false;
        };
    }, [bookId]);

    const closeToast = () => {
        setIsToastOpen(false);
    };

    // Adds a blank page form; it is only persisted once the user saves it.
    const handleAddPage = () => {
        setPages((previousPages) => [...previousPages, { key: generateKey(), initialValues: emptyPageValues }]);
    };

    const handleRemovePage = (key: string) => async () => {
        const pageEntry = pages.find((entry) => entry.key === key);

        if (!pageEntry?.pageId) {
            setPages((previousPages) => previousPages.filter((entry) => entry.key !== key));
            return;
        }

        try {
            const response = await bookService.deleteBookPage(pageEntry.pageId);

            if (bookService.isBookError(response)) {
                setToastSeverity('error');
                setToastMessage(response.error);
                setIsToastOpen(true);
                return;
            }

            setPages((previousPages) => previousPages.filter((entry) => entry.key !== key));
            setToastSeverity('success');
            setToastMessage('Page removed successfully.');
            setIsToastOpen(true);
        } catch (error: unknown) {
            setToastSeverity('error');
            setToastMessage(error instanceof Error ? error.message : 'Failed to remove page.');
            setIsToastOpen(true);
        }
    };

    const handleSavePage =
        (key: string) => async (values: PageFormValues, formikHelpers: FormikHelpers<PageFormValues>) => {
            if (!bookId) {
                return;
            }

            try {
                const pageEntry = pages.find((entry) => entry.key === key);
                let imageUrl = values.imageUrl;

                if (imageUrl instanceof File) {
                    const blob = await readFileAsBase64(imageUrl);
                    const [uploadedName] = await assetService.uploadAssets([
                        {
                            blob,
                            filename: imageUrl.name,
                        },
                    ]);

                    imageUrl = uploadedName ? buildAssetUrl(uploadedName) : '';
                }

                const image = imageUrl ? [{ type: 'cover', url: imageUrl }] : null;

                const response = await bookService.addOrUpdateBookPage({
                    _id: pageEntry?.pageId,
                    bookId,
                    title: values.title,
                    image,
                    summary: values.summary,
                    highlight: values.highlight,
                });

                if (bookService.isBookError(response)) {
                    setToastSeverity('error');
                    setToastMessage(response.error);
                    setIsToastOpen(true);
                    return;
                }

                setPages((previousPages) =>
                    previousPages.map((entry) => (entry.key === key ? { ...entry, pageId: response._id } : entry)),
                );
                formikHelpers.resetForm({ values: { ...values, imageUrl } });

                setToastSeverity('success');
                setToastMessage('Page saved successfully.');
                setIsToastOpen(true);
            } catch (error: unknown) {
                setToastSeverity('error');
                setToastMessage(error instanceof Error ? error.message : 'Failed to save page.');
                setIsToastOpen(true);
            }
        };

    return {
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
    };
}

export default useBookPage;
