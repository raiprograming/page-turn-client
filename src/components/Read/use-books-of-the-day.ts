import { useNavigate } from 'react-router';

export function useBooksOfTheDay() {
    const navigate = useNavigate();

    const handleOpenBook = (bookId?: string) => {
        if (bookId) {
            navigate(`/read/${bookId}`);
        }
    };

    return { handleOpenBook };
}
