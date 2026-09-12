import { createContext } from 'react';
import type {
    FormikErrors,
    FormikHelpers,
    FormikProps,
    FormikTouched,
    FormikValues,
} from 'formik';

export interface FormState<TValues extends FormikValues = FormikValues> {
    id: string;
    currentValue: TValues;
    errorState: FormikErrors<TValues>;
    touchedState: FormikTouched<TValues>;
    isSubmitting: boolean;
    isValid: boolean;
    dirty: boolean;
    submitCount: number;
    handleChange: FormikProps<TValues>['handleChange'];
    handleBlur: FormikProps<TValues>['handleBlur'];
    handleReset: FormikProps<TValues>['handleReset'];
    resetForm: FormikHelpers<TValues>['resetForm'];
    setFieldValue: FormikHelpers<TValues>['setFieldValue'];
    setFieldTouched: FormikHelpers<TValues>['setFieldTouched'];
    setValues: FormikHelpers<TValues>['setValues'];
    submitForm: FormikHelpers<TValues>['submitForm'];
    handleRefresh: () => void | Promise<void>;
}

export type AnyFormState = FormState<FormikValues>;

export const FormContext = createContext<AnyFormState | null>(null);
