import { useEffect, useState } from 'react';
import { authService } from '../../api';

function useLogin(code: string) {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const response = await authService.getUserInfoFromCode(code, import.meta.env.VITE_GOOGLE_REDIRECT_URL);
            if (response.error) {
                console.error('Failed to fetch user info', response.error);
                return;
            }
            // Handle the user info response here
            console.log('User info:', response.data);

            const userInfo = {
                userId: response.data.userId,
                name: response.data.name,
                email: response.data.email,
                picture: response.data.picture,
                role: response.data.role,
            }

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            window.location.href = '/'; // Redirect to the home page after successful login
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    // Handles the email/password login button click. Calls the
    // /email/login server route and stores the returned user info,
    // matching the behaviour of the Google login flow above.
    const handleEmailLogin = async (email: string, password: string) => {
        setLoginError(null);
        setIsLoggingIn(true);
        try {
            const response = await authService.emailLogin(email, password);
            if (response.error) {
                setLoginError(typeof response.error === 'string' ? response.error : 'Invalid email or password.');
                return;
            }

            const userInfo = {
                userId: response.data._id,
                name: response.data.name,
                email: response.data.email,
                picture: response.data.picture,
                mobile: response.data.mobile,
                role: response.data.role,
            };

            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            window.location.href = '/'; // Redirect to the home page after successful login
        } catch (error) {
            console.error('Error during email login:', error);
            setLoginError('Something went wrong. Please try again.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    useEffect(() => {
        if (code) {
            handleLogin();
        }
    }, [code]);

    return { handleEmailLogin, isLoggingIn, loginError };
}

export default useLogin;