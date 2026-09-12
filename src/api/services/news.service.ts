import apiClient from '../client';
import { NEWS_ENDPOINTS } from '../endpoints';

export interface NewsImage {
  type: string;
  name: string;
}

export interface NewsRequestBody {
  title: string;
  category: string;
  criticality: string;
  audience: string;
  audienceDescription?: string;
  readDuration: string;
  summary: string;
  whyItMatters: string;
  image: NewsImage[];
  createdBy: string;
}

export interface NewsListRequestBody {
  category?: string;
  criticality?: string;
  audience?: string;
  page?: number;
  limit?: number;
}

export interface NewsListItem {
  _id?: string;
  title: string;
  category: string;
  criticality: string;
  audience: string;
  audienceDescription?: string;
  readDuration: string;
  summary: string;
  whyItMatters: string;
  image: NewsImage[];
  createdBy: string;
  createdAt: number;
}

export interface NewsAddResponse extends NewsListItem {}

export interface NewsDeleteResponse extends NewsListItem {}

export interface NewsErrorResponse {
  error: string;
}

export const addNews = async (body: NewsRequestBody): Promise<NewsAddResponse | NewsErrorResponse> => {
  const { data } = await apiClient.post<NewsAddResponse | NewsErrorResponse>(
    NEWS_ENDPOINTS.add,
    body,
  );

  return data;
};

export const listNews = async (body: NewsListRequestBody): Promise<NewsListItem[] | NewsErrorResponse> => {
  const { data } = await apiClient.post<NewsListItem[] | NewsErrorResponse>(
    NEWS_ENDPOINTS.list,
    body,
  );

  return data;
};

export const deleteNews = async (newsId: string): Promise<NewsDeleteResponse | NewsErrorResponse> => {
  const { data } = await apiClient.delete<NewsDeleteResponse | NewsErrorResponse>(
    `${NEWS_ENDPOINTS.remove}/${newsId}`,
  );

  return data;
};
