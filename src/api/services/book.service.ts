import apiClient from '../client';
import { BOOK_ENDPOINTS } from '../endpoints';

export interface BookCategoryRating {
  category: string;
  rating: number;
}

export interface BookImage {
  type: string;
  url: string;
}

export interface BookPageImage {
  type: string;
  url: string;
}

export interface BookErrorResponse {
  error: string;
}

export interface AddBookRequestBody {
  name: string;
  authorName: string;
  aboutTheBook: string;
  categoryRatings: BookCategoryRating[];
  readDuration: string;
  image: BookImage[];
}

export interface Book extends AddBookRequestBody {
  _id: string;
}

export interface ListBooksRequestBody {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface BookPage {
  _id: string;
  bookId: string;
  title: string;
  image: BookPageImage[];
  summary: string;
  highlight: string;
}

export interface BookDetails extends Book {
  pages: BookPage[];
}

// Omit `_id` to create a page; include it to update an existing one.
export interface AddOrUpdateBookPageRequestBody {
  _id?: string;
  bookId: string;
  title: string;
  image: BookPageImage[];
  summary: string;
  highlight: string;
}

export interface DeleteBookPageRequestBody {
  _id: string;
}

export type DeleteBookPageResponse = BookPage | BookErrorResponse;
export type AddBookResponse = Book | BookErrorResponse;
export type ListBooksResponse = Book[] | BookErrorResponse;
export type GetBookDetailsResponse = BookDetails | BookErrorResponse;
export type AddOrUpdateBookPageResponse = BookPage | BookErrorResponse;

export const isBookError = <T>(response: T | BookErrorResponse): response is BookErrorResponse =>
  typeof response === 'object' && response !== null && 'error' in response;

export const listBooks = async (body: ListBooksRequestBody = {}): Promise<ListBooksResponse> => {
  const { data } = await apiClient.post<ListBooksResponse>(BOOK_ENDPOINTS.list, body);

  return data;
};

export const getBookDetails = async (bookId: string): Promise<GetBookDetailsResponse> => {
  const { data } = await apiClient.get<GetBookDetailsResponse>(
    `${BOOK_ENDPOINTS.detail}/${encodeURIComponent(bookId)}`,
  );

  return data;
};

export const addBook = async (body: AddBookRequestBody): Promise<AddBookResponse> => {
  const { data } = await apiClient.post<AddBookResponse>(BOOK_ENDPOINTS.add, body);

  return data;
};

export const addOrUpdateBookPage = async (
  body: AddOrUpdateBookPageRequestBody,
): Promise<AddOrUpdateBookPageResponse> => {
  const { data } = await apiClient.post<AddOrUpdateBookPageResponse>(
    BOOK_ENDPOINTS.addOrUpdatePage,
    body,
  );

  return data;
};

export const deleteBookPage = async (bookPageId: string): Promise<DeleteBookPageResponse> => {
  const body: DeleteBookPageRequestBody = { _id: bookPageId };
  const { data } = await apiClient.post<DeleteBookPageResponse>(BOOK_ENDPOINTS.deletePage, body);

  return data;
};
