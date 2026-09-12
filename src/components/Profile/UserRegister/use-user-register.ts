import { useState } from 'react';

export interface UserRegisterFormValues {
    name: string;
    email: string;
    password: string;
}

export type UserRegisterFormErrors = Partial<Record<keyof UserRegisterFormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function useUserRegister(onClose: () => void) {
    const [values, setValues] = useState<UserRegisterFormValues>({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState<UserRegisterFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof UserRegisterFormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [field]: event.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const nextErrors: UserRegisterFormErrors = {};

        if (!values.name.trim()) {
            nextErrors.name = 'Name is required';
        }
        if (!values.email.trim()) {
            nextErrors.email = 'Email is required';
        } else if (!EMAIL_REGEX.test(values.email.trim())) {
            nextErrors.email = 'Enter a valid email address';
        }
        if (!values.password.trim()) {
            nextErrors.password = 'Password is required';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetForm = () => {
        setValues({ name: '', email: '', password: '' });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: wire up to a registration API endpoint once available.
            console.log('Registering user:', values);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return { values, errors, isSubmitting, handleChange, handleSubmit, handleClose };
}

export default useUserRegister;
