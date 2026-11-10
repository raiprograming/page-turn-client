import { useEffect, useState, type SyntheticEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { type HyperParameterOption } from '../../api';
import useMultiOption from './use-multi-option';
import styles from '../Option/option.module.css';

interface MultiOptionProps {
  name: string;
  entity: string;
  type: string;
  label: string;
  className?: string;
  value?: HyperParameterOption[];
  setFieldValue?: (field: string, value: HyperParameterOption[]) => void;
  onChange?: (options: HyperParameterOption[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

function MultiOption({
  name,
  entity,
  type,
  label,
  className,
  value = [],
  setFieldValue,
  onChange,
  placeholder,
  disabled = false,
  error,
  helperText,
}: MultiOptionProps) {
  const { options, loading, error: fetchError } = useMultiOption({ entity, type });
  const [selectedOptions, setSelectedOptions] = useState<HyperParameterOption[]>(value);

  useEffect(() => {
    setSelectedOptions(value);
  }, [value, entity, type]);

  const handleChange = (_event: SyntheticEvent, nextValue: HyperParameterOption[]) => {
    setSelectedOptions(nextValue);
    setFieldValue?.(name, nextValue);
    onChange?.(nextValue);
  };

  const hasError = Boolean(fetchError) || Boolean(error);
  const displayHelperText = fetchError || helperText || ' ';

  return (
    <div className={`${styles.optionContainer} ${className ?? ''}`.trim()}>
      <Autocomplete
        multiple
        className={styles.optionAutocomplete}
        options={options}
        loading={loading}
        disabled={disabled || loading}
        value={selectedOptions}
        onChange={handleChange}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, currentValue) => option.value === currentValue.value}
        noOptionsText={loading ? 'Loading options...' : 'No options available'}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            id={name}
            label={label}
            placeholder={placeholder}
            error={hasError}
            helperText={displayHelperText}
            fullWidth
            size="small"
          />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            <div className={styles.optionItem}>
              <span className={styles.optionName}>{option.name}</span>
            </div>
          </li>
        )}
      />
    </div>
  );
}

export default MultiOption;
