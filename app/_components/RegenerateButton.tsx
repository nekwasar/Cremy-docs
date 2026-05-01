'use client';

import { useGenerateStore } from '@/store/generate-store';

interface RegenerateButtonProps {
  socket: any;
}

export function RegenerateButton({ socket }: RegenerateButtonProps) {
  const { originalInput } = useGenerateStore.getState();

  const handleRegenerate = () => {
    if (!socket?.connected || !originalInput) return;

    const { selectedStructure, selectedTemplate } = useGenerateStore.getState();

    socket.emit('generate', {
      text: originalInput,
      formatId: selectedStructure || 'auto',
      templateId: selectedTemplate,
    });
  };

  return (
    <button onClick={handleRegenerate} disabled={!originalInput} type="button">
      Regenerate
    </button>
  );
}