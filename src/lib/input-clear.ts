interface ClearOptions {
  hasContent: boolean;
  hasDocument: boolean;
}

export function shouldConfirmClear(options: ClearOptions): boolean {
  return options.hasContent && options.hasDocument;
}

export function confirmClearMessage(): string {
  return 'You have an active document. Are you sure you want to clear? Unsaved changes will be lost.';
}

export function performClear(
  onClear: () => void,
  options: ClearOptions,
  skipConfirmation: boolean = false
): boolean {
  if (!skipConfirmation && shouldConfirmClear(options)) {
    if (typeof window !== 'undefined' && !window.confirm(confirmClearMessage())) {
      return false;
    }
  }

  onClear();
  return true;
}