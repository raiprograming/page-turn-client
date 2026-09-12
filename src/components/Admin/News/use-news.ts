import { useState } from 'react';
import type { FormikHelpers } from 'formik';
import {
    ASSET_ENDPOINTS,
    assetService,
    newsService,
    type HyperParameterOption,
    type NewsListItem,
    type NewsListRequestBody,
    type NewsRequestBody,
} from '../../../api';
import { API_BASE_URL } from '../../../api/config';
import { useAppSelector } from '../../../store/hooks';

export interface NewsFormValues {
    title: string;
    image: File | null;
    // Display-only: holds the uploaded image's name when rendering an existing news item.
    imageName: string;
    category: HyperParameterOption | null;
    criticality: HyperParameterOption | null;
    audience: HyperParameterOption | null;
    audienceDescription: string;
    readDuration: string;
    whyItMatters: string;
    summary: string;
}

// Fetches a page of existing news, throwing so callers can handle the error in one place.
export async function fetchNewsList(body: NewsListRequestBody): Promise<NewsListItem[]> {
    const response = await newsService.listNews(body);

    if (response && typeof response === 'object' && 'error' in response && response.error) {
        throw new Error(response.error);
    }

    return response as NewsListItem[];
}

export function mapNewsListItemToFormValues(item: NewsListItem): NewsFormValues {
    return {
        title: item.title,
        image: null,
        imageName: item.image?.[0]?.name ?? '',
        category: item.category ? { value: item.category, name: item.category } : null,
        criticality: item.criticality ? { value: item.criticality, name: item.criticality } : null,
        audience: item.audience ? { value: item.audience, name: item.audience } : null,
        audienceDescription: item.audienceDescription ?? '',
        readDuration: item.readDuration ?? '',
        whyItMatters: item.whyItMatters,
        summary: item.summary,
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

function buildUploadedImages(uploadedNames: string[]): NewsRequestBody['image'] {
    return uploadedNames.map((uploadedName) => ({
        type: 'cover',
        name: uploadedName,
    }));
}

// Builds the API url that serves an uploaded asset by its file name.
export function buildAssetUrl(filename: string): string {
    const baseUrl = (API_BASE_URL || '').replace(/\/$/, '');

    return `${baseUrl}${ASSET_ENDPOINTS.url}?filename=${encodeURIComponent(filename)}`;
}

function buildNewsRequestBody(values: NewsFormValues, image: NewsRequestBody['image'], createdBy: string): NewsRequestBody {
    return {
        title: values.title,
        image,
        category: values.category?.value ?? '',
        criticality: values.criticality?.value ?? '',
        audience: values.audience?.value ?? '',
        audienceDescription: values.audienceDescription,
        readDuration: values.readDuration,
        whyItMatters: values.whyItMatters,
        summary: values.summary,
        createdBy,
    };
}

function useNews(onNewsAdded?: () => void) {
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
    const [isToastOpen, setIsToastOpen] = useState(false);
    const userInfo = useAppSelector((state) => state.user.userInfo);

    const closeToast = () => {
        setIsToastOpen(false);
    };

    const handleSubmitNews = async (values: NewsFormValues, formikHelpers: FormikHelpers<NewsFormValues>) => {
        try {
            const createdBy = userInfo?.userId;

            if (!createdBy) {
                setToastSeverity('error');
                setToastMessage('User id is required to create news.');
                setIsToastOpen(true);
                return;
            }

            let image: NewsRequestBody['image'] = [];

            if (values.image) {
                const blob = await readFileAsBase64(values.image);
                const uploadedNames = await assetService.uploadAssets([
                    {
                        blob,
                        filename: values.image.name,
                    },
                ]);

                image = buildUploadedImages(uploadedNames);
            }

            const newsRequestBody = buildNewsRequestBody(values, image, createdBy);
            const response = await newsService.addNews(newsRequestBody);

            if (response && typeof response === 'object' && 'error' in response && response.error) {
                setToastSeverity('error');
                setToastMessage(response.error);
                setIsToastOpen(true);
                return;
            }

            setToastSeverity('success');
            setToastMessage('News added successfully.');
            setIsToastOpen(true);

            // Empty the form fields and pull the latest news list from the db.
            formikHelpers.resetForm();
            onNewsAdded?.();
        } catch (error: unknown) {
            setToastSeverity('error');
            setToastMessage(error instanceof Error ? error.message : 'Failed to add news.');
            setIsToastOpen(true);
        }
    };

    return { handleSubmitNews, toastMessage, toastSeverity, isToastOpen, closeToast };
}

export default useNews;
