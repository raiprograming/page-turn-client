import { Formik, Form as FormikForm } from 'formik';
import type { ReactNode } from 'react';
import type { AnyObjectSchema } from 'yup';
import type { FormikConfig, FormikValues } from 'formik';
import { FormContext, type AnyFormState, type FormState } from './form-context';

interface FormProps<TValues extends FormikValues> {
    id: string;
    validationSchema: AnyObjectSchema;
    initialValue: TValues;
    onSubmit: FormikConfig<TValues>['onSubmit'];
    onRefresh?: () => void | Promise<void>;
    children: ReactNode;
}

function Form<TValues extends FormikValues>({
    id,
    validationSchema,
    initialValue,
    onSubmit,
    onRefresh,
    children,
}: FormProps<TValues>) {
    return (
        <Formik
            initialValues={initialValue}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {(formik) => {
                const formState: FormState<TValues> = {
                    id,
                    currentValue: formik.values,
                    errorState: formik.errors,
                    touchedState: formik.touched,
                    isSubmitting: formik.isSubmitting,
                    isValid: formik.isValid,
                    dirty: formik.dirty,
                    submitCount: formik.submitCount,
                    handleChange: formik.handleChange,
                    handleBlur: formik.handleBlur,
                    handleReset: formik.handleReset,
                    resetForm: formik.resetForm,
                    setFieldValue: formik.setFieldValue,
                    setFieldTouched: formik.setFieldTouched,
                    setValues: formik.setValues,
                    submitForm: formik.submitForm,
                    handleRefresh: async () => {
                        formik.resetForm();

                        if (onRefresh) {
                            await onRefresh();
                        }
                    },
                };

                return (
                    <FormContext.Provider value={formState as unknown as AnyFormState}>
                        <FormikForm id={id} noValidate>
                            {children}
                        </FormikForm>
                    </FormContext.Provider>
                );
            }}
        </Formik>
    );
}

export default Form;
