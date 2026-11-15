import { IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import type { ChangeEvent, KeyboardEvent } from 'react';
import styles from './read.module.css';

interface SearchBoxProps {
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function SearchBox({ value, onChange, onSubmit, onKeyDown }: SearchBoxProps) {
    return (
        <div className={styles.searchBox}>
            <InputBase
                fullWidth
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder="Search a book or author"
                className={styles.searchInput}
                inputProps={{ 'aria-label': 'Search a book or author' }}
            />
            <IconButton aria-label="Search" onClick={onSubmit} className={styles.searchButton}>
                <SearchIcon />
            </IconButton>
        </div>
    );
}

export default SearchBox;
