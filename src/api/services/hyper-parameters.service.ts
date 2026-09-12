import apiClient from '../client';
import { HYPER_PARAMETER_ENDPOINTS } from '../endpoints';

export interface HyperParameterOption {
  value: string;
  name: string;
}

export const getHyperParameters = async (entity: string, type: string): Promise<unknown> => {
  const { data } = await apiClient.post(
    HYPER_PARAMETER_ENDPOINTS.list,
    { entity, type },
  );

  return data;
};
