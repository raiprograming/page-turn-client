import { useEffect, useState } from 'react';
import { hyperParameterService, type HyperParameterOption } from '../../api';

interface UseOptionParams {
  entity: string;
  type: string;
}

interface HyperParameterErrorResponse {
  error?: string;
  message?: string;
}

function useOption({ entity, type }: UseOptionParams) {
  const [options, setOptions] = useState<HyperParameterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadOptions = async () => {
      const normalizedEntity = entity.trim();
      const normalizedType = type.trim();

      if (!normalizedEntity || !normalizedType) {
        if (isActive) {
          setOptions([]);
          setError('Entity and type are required to load options.');
        }

        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await hyperParameterService.getHyperParameters(normalizedEntity, normalizedType);

        if (!isActive) {
          return;
        }

        if (Array.isArray(response)) {
          setOptions(response);
          return;
        }

        if (response && typeof response === 'object') {
          const responseData = response as HyperParameterErrorResponse;

          if (typeof responseData.error === 'string' && responseData.error.trim()) {
            setOptions([]);
            setError(responseData.error);
            return;
          }

          if (typeof responseData.message === 'string' && responseData.message.trim()) {
            setOptions([]);
            setError(responseData.message);
            return;
          }
        }

        setOptions([]);
        setError('Unexpected response from the options API.');
      } catch (caughtError: unknown) {
        if (isActive) {
          setOptions([]);
          setError(caughtError instanceof Error ? caughtError.message : 'Failed to load options.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadOptions();

    return () => {
      isActive = false;
    };
  }, [entity, type]);

  return { options, loading, error };
}

export default useOption;
