import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearUserInfo } from '../../store/slices/userSlicer';
import { clearUserInfoFromStorage } from '../../store/slices/userSlicer.utils';

/**
 * Reads the current user's info from the userSlicer store. The store's
 * initial state is hydrated from localStorage (see userSlicer.utils.ts),
 * so this reflects whether a userInfo object exists in localStorage.
 */
function useProfile() {
    const dispatch = useAppDispatch();
    const userInfo = useAppSelector((state) => state.user.userInfo);

    const handleLogout = () => {
        clearUserInfoFromStorage();
        dispatch(clearUserInfo());
        window.location.href = '/profile';
    };

    return { userInfo, handleLogout };
}

export default useProfile;
