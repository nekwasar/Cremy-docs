export interface SocketEventPayloads {
  generate: { text: string; formatId?: string; tone?: string; templateId?: string };
  edit: { documentId: string; instruction: string };
  format: { text: string; formatId: string };
  translate: { text: string; targetLang: string; sourceLang?: string };
  summarize: { text: string };
  cancel: {};
}

export type SocketEventType = keyof SocketEventPayloads;

export interface SocketEventDefinition {
  type: SocketEventType;
  requiresAuth: boolean;
  requiresCredits: boolean;
  handler: string;
}

export const SOCKET_EVENTS: Record<SocketEventType, SocketEventDefinition> = {
  generate: { type: 'generate', requiresAuth: false, requiresCredits: true, handler: 'generate-handler' },
  edit: { type: 'edit', requiresAuth: true, requiresCredits: true, handler: 'edit-handler' },
  format: { type: 'format', requiresAuth: false, requiresCredits: false, handler: 'format-handler' },
  translate: { type: 'translate', requiresAuth: false, requiresCredits: true, handler: 'translate-handler' },
  summarize: { type: 'summarize', requiresAuth: false, requiresCredits: true, handler: 'summarize-handler' },
  cancel: { type: 'cancel', requiresAuth: false, requiresCredits: false, handler: 'generate-handler' },
};
