import { useNavigate } from 'react-router';


export function useBookCard(bookId?: string) {
    const navigate = useNavigate();

    const handleOpenBook = () => {
        if (bookId) {
            navigate(`/read/${bookId}`);
        }
    };

    return { handleOpenBook };
}
