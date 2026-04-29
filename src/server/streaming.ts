interface StreamHandler {
  emit(event: string, data: any): void;
  socket: any;
}

export function sendStartEvent(handler: StreamHandler, documentId: string): void {
  handler.emit('start', { documentId });
}

export function sendChunkEvent(handler: StreamHandler, chunk: string, progress: number): void {
  handler.emit('chunk', { chunk, progress });
}

export function sendCompleteEvent(handler: StreamHandler, document: any): void {
  handler.emit('complete', { document });
}

export function sendErrorEvent(handler: StreamHandler, code: string, message: string): void {
  handler.emit('error', { code, message });
}

export function sendTimeoutEvent(handler: StreamHandler): void {
  handler.emit('timeout', {});
}

export function sendCreditUpdateEvent(handler: StreamHandler, credits: number): void {
  handler.emit('credit_update', { credits });
}

export function sendCancelledEvent(handler: StreamHandler): void {
  handler.emit('cancelled', {});
}