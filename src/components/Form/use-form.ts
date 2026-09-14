import { useContext } from 'react';
import type { FormikValues } from 'formik';
import { FormContext, type AnyFormState, type FormState } from './form-context';

function useForm<TValues extends FormikValues = FormikValues>(id: string) {
    const formState = useContext(FormContext) as AnyFormState | null;

    if (!formState) {
        throw new Error('useForm must be used inside a Form component.');
    }

    if (formState.id !== id) {
        throw new Error(`useForm(${id}) was called outside the matching form context.`);
    }

    const matchedState = formState as unknown as FormState<TValues>;

    return {
        id: matchedState.id,
        currentValue: matchedState.currentValue,
        values: matchedState.currentValue,
        errorState: matchedState.errorState,
        errors: matchedState.errorState,
        touchedState: matchedState.touchedState,
        touched: matchedState.touchedState,
        isSubmitting: matchedState.isSubmitting,
        isValid: matchedState.isValid,
        dirty: matchedState.dirty,
        submitCount: matchedState.submitCount,
        handleChange: matchedState.handleChange,
        handleBlur: matchedState.handleBlur,
        handleReset: matchedState.handleReset,
        resetForm: matchedState.resetForm,
        setFieldValue: matchedState.setFieldValue,
        setFieldTouched: matchedState.setFieldTouched,
        setValues: matchedState.setValues,
        submitForm: matchedState.submitForm,
        handleRefresh: matchedState.handleRefresh,
    };
}

export default useForm;
