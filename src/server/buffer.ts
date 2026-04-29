interface BufferOptions {
  size: number;
  intervalMs: number;
  onFlush: (text: string) => void;
}

export class ChunkBuffer {
  private buffer: string = '';
  private options: BufferOptions;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(options: BufferOptions) {
    this.options = options;
  }

  add(chunk: string): void {
    this.buffer += chunk;
    
    if (this.buffer.length >= this.options.size) {
      this.flush();
    }
  }

  flush(): void {
    if (this.buffer.length > 0) {
      this.options.onFlush(this.buffer);
      this.buffer = '';
    }
  }

  start(): void {
    this.intervalId = setInterval(() => this.flush(), this.options.intervalMs);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.flush();
  }
}

export function createBuffer(
  onFlush: (text: string) => void,
  size: number = 100,
  intervalMs: number = 50
): ChunkBuffer {
  return new ChunkBuffer({ size, intervalMs, onFlush });
}