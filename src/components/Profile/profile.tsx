import { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import useLogin from './use-login';
import useProfile from './use-profile';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { useSearchParams } from 'react-router';
import PageturnIcon from '../../assets/pageturn-icon.svg'
import { authService } from '../../api';
import UserRegister from './UserRegister/user-register';
import './profile.css';

function Profile() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const { handleEmailLogin, isLoggingIn, loginError } = useLogin(code || '');
    const { userInfo, handleLogout } = useProfile();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleEmailLogin(email, password);
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await authService.getGoogleRedirectUrl(import.meta.env.VITE_GOOGLE_REDIRECT_URL);

            if (result.error) {
                console.error('Failed to fetch Google redirect URL', result.error);
                return;
            }
            window.location.href = result.data.redirectUrl;
        } catch (error) {
            console.error('Failed to fetch Google redirect URL', error);
        }
    };

    if (userInfo) {
        return (
            <div className="loginContainer">
                <Box className="profileCard">
                    <Typography variant="h6" className="profileHeader">
                        Your Profile
                    </Typography>
                    <Avatar
                        className="profileAvatar"
                        src={userInfo.picture}
                        alt={userInfo.name}
                    >
                        {userInfo.name?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Box className="profileForm">
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={userInfo.name || ''}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <TextField
                            label="Email address"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={userInfo.email || ''}
                            slotProps={{ input: { readOnly: true } }}
                        />
                        <TextField
                            label="Mobile number"
                            variant="outlined"
                            fullWidth
                            value={userInfo.mobile ?? ''}
                            placeholder="Not added"
                            slotProps={{ input: { readOnly: true } }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        className="logoutButton"
                        onClick={handleLogout}
                    >
                        Log out
                    </Button>
                </Box>
            </div>
        );
    }

    return (
        <div className="loginContainer">
            {
                code ? (
                    <div className="loginContainer">
                <Box className="loginCard">
                    <img className="logo" src={PageturnIcon} alt="Page Turn Icon" />
                    <CircularProgress className='primaryText'  />
                    <Typography className="subtitle" sx={{ mt: 2 }}>
                        Signing you in...
                    </Typography>
                </Box>
            </div>
                ) : (
                    <Box className="loginCard">
                <img className="logo" src={PageturnIcon} alt="Page Turn Icon" />
                <Typography variant="h6" className="title">
                    Welcome to Page Turn
                </Typography>
                <Typography className="subtitle">
                    Create your reader account in seconds
                </Typography>

                <Box component="form" className="loginForm" onSubmit={handleSubmit}>
                    <TextField
                        label="Email address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {loginError && (
                        <Typography color="error" variant="body2">
                            {loginError}
                        </Typography>
                    )}
                    <Button
                        sx={{background: "#e65100"}}
                        type="submit"
                        variant="contained"
                        className="submitButton"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Log in'}
                    </Button>
                </Box>


                <Box className="socialButtons">
                    <Button sx={{color: "#e65100", textTransform: "none"}} variant="outlined" className="socialButton" startIcon={<GoogleIcon />} onClick={handleGoogleLogin}>
                        Continue with Google
                    </Button>
                    <Button sx={{color: "#e65100", textTransform: "none"}} variant="outlined" className="socialButton" startIcon={<PhoneAndroidIcon />}>
                        Continue with Phone
                    </Button>
                </Box>

                <Typography className="divider">Or</Typography>

                <Box className="signupPrompt">
                    <a
                        style={{color: "#e65100", textTransform: "none"}}
                        onClick={(event) => {
                            event.preventDefault();
                            setIsRegisterOpen(true);
                        }}
                    >
                        create an account manually
                    </a>
                </Box>
            </Box>
                )
            }

            <UserRegister open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </div>
    )
}

export default Profile;