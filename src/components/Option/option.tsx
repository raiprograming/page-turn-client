import { useEffect, useState, type SyntheticEvent } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { type HyperParameterOption } from '../../api';
import useOption from './use-option';
import styles from './option.module.css';

interface OptionProps {
  name: string;
  entity: string;
  type: string;
  label: string;
  className?: string;
  value?: HyperParameterOption | null;
  setFieldValue?: (field: string, value: HyperParameterOption | null) => void;
  onChange?: (option: HyperParameterOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

function Option({
  name,
  entity,
  type,
  label,
  className,
  value = null,
  setFieldValue,
  onChange,
  placeholder,
  disabled = false,
  error,
  helperText,
}: OptionProps) {
  const { options, loading, error: fetchError } = useOption({ entity, type });
  const [selectedOption, setSelectedOption] = useState<HyperParameterOption | null>(value);

  useEffect(() => {
    setSelectedOption(value);
  }, [value, entity, type]);

  const handleChange = (_event: SyntheticEvent, nextValue: HyperParameterOption | null) => {
    setSelectedOption(nextValue);
    setFieldValue?.(name, nextValue);
    onChange?.(nextValue);
  };

  const hasError = Boolean(fetchError) || Boolean(error);
  const displayHelperText = fetchError || helperText || ' ';

  return (
    <div className={`${styles.optionContainer} ${className ?? ''}`.trim()}>
      <Autocomplete
        className={styles.optionAutocomplete}
        options={options}
        loading={loading}
        disabled={disabled || loading}
        value={selectedOption}
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

export default Option;
