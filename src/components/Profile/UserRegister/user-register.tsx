import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useUserRegister from './use-user-register';
import './user-register.css';

interface UserRegisterProps {
    open: boolean;
    onClose: () => void;
}

function UserRegister({ open, onClose }: UserRegisterProps) {
    const { values, errors, isSubmitting, handleChange, handleSubmit, handleClose } = useUserRegister(onClose);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle className="registerDialogTitle">
                <Typography variant="h6">Create your account</Typography>
                <IconButton className="registerCloseButton" onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box component="form" className="registerForm" onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={values.name}
                        onChange={handleChange('name')}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Email address"
                        type="email"
                        variant="outlined"
                        fullWidth
                        required
                        value={values.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        value={values.password}
                        onChange={handleChange('password')}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="registerSubmitButton"
                        disabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default UserRegister;
