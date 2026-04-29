interface FormDefaults {
  [key: string]: unknown;
}

interface ResetOptions {
  onConfirm?: () => void;
  onCancel?: () => void;
  message?: string;
}

export function confirmFormReset(message?: string): boolean {
  const defaultMessage = 'This will clear all form fields. Continue?';
  return window.confirm(message || defaultMessage);
}

export function resetFormFields(defaults: FormDefaults): FormDefaults {
  return { ...defaults };
}

export function handleFormReset(
  currentValues: FormDefaults,
  defaults: FormDefaults,
  onReset: (values: FormDefaults) => void,
  options: ResetOptions = {}
): boolean {
  const hasChanges = Object.keys(currentValues).some(
    (key) => currentValues[key] !== defaults[key]
  );

  if (!hasChanges) {
    onReset(defaults);
    return true;
  }

  if (!confirmFormReset(options.message)) {
    options.onCancel?.();
    return false;
  }

  options.onConfirm?.();
  onReset(defaults);
  return true;
}