interface InputSendOptions {
  onSubmit: (inputValue: string) => void;
  minLength?: number;
}

export function handleInputSend(inputValue: string, options: InputSendOptions): boolean {
  const { onSubmit, minLength = 1 } = options;

  if (!inputValue || inputValue.trim().length < minLength) {
    return false;
  }

  onSubmit(inputValue.trim());
  return true;
}

export function handleEnterKeySubmit(
  event: React.KeyboardEvent,
  inputValue: string,
  options: InputSendOptions
): boolean {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    return handleInputSend(inputValue, options);
  }
  return false;
}