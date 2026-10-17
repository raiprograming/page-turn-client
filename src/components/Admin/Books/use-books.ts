import { useState } from 'react';
import type { FormikHelpers } from 'formik';
import {
    ASSET_ENDPOINTS,
    assetService,
    bookService,
    type AddBookRequestBody,
    type BookCategoryRating,
} from '../../../api';
import { API_BASE_URL } from '../../../api/config';

export interface BookFormValues {
    name: string;
    authorName: string;
    aboutTheBook: string;
    categoryRatings: BookCategoryRating[];
    readDuration: string;
    image: File | null;
    // Display-only: holds the uploaded image's name so it can be previewed.
    imageName: string;
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
export function buildAssetUrl(filename: string): string {
    const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');

    return `${baseUrl}${ASSET_ENDPOINTS.url}?filename=${encodeURIComponent(filename)}`;
}

function buildBookRequestBody(values: BookFormValues, image: AddBookRequestBody['image']): AddBookRequestBody {
    return {
        name: values.name,
        authorName: values.authorName,
        aboutTheBook: values.aboutTheBook,
        categoryRatings: values.categoryRatings,
        readDuration: values.readDuration,
        image,
    };
}

function useBooks(onBookAdded?: () => void) {
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
    const [isToastOpen, setIsToastOpen] = useState(false);

    const closeToast = () => {
        setIsToastOpen(false);
    };

    const handleSubmitBook = async (values: BookFormValues, formikHelpers: FormikHelpers<BookFormValues>) => {
        try {
            let image: AddBookRequestBody['image'] = [];

            if (values.image) {
                const blob = await readFileAsBase64(values.image);
                const [uploadedName] = await assetService.uploadAssets([
                    {
                        blob,
                        filename: values.image.name,
                    },
                ]);

                image = uploadedName ? [{ type: 'cover', url: buildAssetUrl(uploadedName) }] : [];
            }

            const bookRequestBody = buildBookRequestBody(values, image);
            const response = await bookService.addBook(bookRequestBody);

            if (bookService.isBookError(response)) {
                setToastSeverity('error');
                setToastMessage(response.error);
                setIsToastOpen(true);
                return;
            }

            setToastSeverity('success');
            setToastMessage('Book added successfully.');
            setIsToastOpen(true);

            // Empty the form fields and pull the latest book list from the db.
            formikHelpers.resetForm();
            onBookAdded?.();
        } catch (error: unknown) {
            setToastSeverity('error');
            setToastMessage(error instanceof Error ? error.message : 'Failed to add book.');
            setIsToastOpen(true);
        }
    };

    return { handleSubmitBook, toastMessage, toastSeverity, isToastOpen, closeToast };
}

export default useBooks;
