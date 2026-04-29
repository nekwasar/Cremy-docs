const SAVE_INTERVAL_MS = 30000;

interface AutoSaveConfig {
  interval?: number;
  onSave: (content: string) => void;
  onRestore: () => string | null;
}

interface AutoSaveInstance {
  start: () => void;
  stop: () => void;
  save: (content: string) => void;
  restore: () => string | null;
}

export function createAutoSave(config: AutoSaveConfig): AutoSaveInstance {
  let intervalId: NodeJS.Timeout | null = null;
  let currentContent = '';

  const save = (content: string) => {
    currentContent = content;
    config.onSave(content);
  };

  const start = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      if (currentContent) {
        config.onSave(currentContent);
      }
    }, config.interval || SAVE_INTERVAL_MS);

    const handleBeforeUnload = () => {
      if (currentContent) {
        config.onSave(currentContent);
      }
    };

    const handleBlur = () => {
      if (currentContent) {
        config.onSave(currentContent);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('blur', handleBlur);
    }
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const restore = () => {
    return config.onRestore();
  };

  return { start, stop, save, restore };
}