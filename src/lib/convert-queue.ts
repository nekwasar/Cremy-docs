interface ConversionQueueItem {
  id: string;
  file: File;
  targetFormat: string;
  status: 'queued' | 'processing' | 'complete' | 'failed';
  error?: string;
  result?: Blob;
}

const queue: ConversionQueueItem[] = [];
let isProcessing = false;

export function addToQueue(file: File, targetFormat: string): string {
  const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  queue.push({ id, file, targetFormat, status: 'queued' });
  return id;
}

export function getQueuePosition(id: string): number {
  return queue.findIndex((item) => item.id === id);
}

export function getQueueItem(id: string): ConversionQueueItem | undefined {
  return queue.find((item) => item.id === id);
}

export function removeFromQueue(id: string): void {
  const index = queue.findIndex((item) => item.id === id);
  if (index !== -1) queue.splice(index, 1);
}

export function clearQueue(): void {
  queue.length = 0;
}

export function getQueueLength(): number {
  return queue.length;
}
