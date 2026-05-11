import { useState, useCallback } from 'react';
import { ValidationRules, ValidationErrors, validateField, validateForm } from '@/lib/validation';

export function useValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateSingleField = useCallback(
    (field: string, value: any) => {
      if (!rules[field]) return null;
      
      const error = validateField(value, rules[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
      return error;
    },
    [rules]
  );

  const validateAllFields = useCallback(
    (data: Record<string, any>) => {
      const newErrors = validateForm(data, rules);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [rules]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback(
    (field: string) => {
      return touched[field] ? errors[field] : undefined;
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    validateSingleField,
    validateAllFields,
    handleBlur,
    clearError,
    clearAllErrors,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}
