import apiClient from '../client';
import { ASSET_ENDPOINTS } from '../endpoints';

export interface AssetImagePayload {
  blob: string | Uint8Array;
  filename: string;
}

export interface AssetUploadResponse {
  uploadedNames: string[];
}

export const uploadAssets = async (images: AssetImagePayload[]): Promise<string[]> => {
  const { data } = await apiClient.post<string[]>(
    ASSET_ENDPOINTS.upload,
    { images },
  );

  return data;
};
