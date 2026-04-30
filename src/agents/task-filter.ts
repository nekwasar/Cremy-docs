const BLOCKED_KEYWORDS = [
  'write code', 'python script', 'javascript function', 'debug this', 'fix this code',
  'what is the weather', 'weather forecast', 'temperature today',
  'play music', 'play a song', 'play some music',
  'tell me a joke', 'who is the president', 'what is the capital',
  'calculate', 'solve this math', 'homework help',
  'generate image', 'draw a picture', 'create a logo',
  'send email', 'send an email',
];

const DOCUMENT_SUGGESTION = 'I help with documents only — creating, editing, converting, translating, and managing files. Want to generate a document instead?';

interface TaskFilterResult {
  allowed: boolean;
  message: string;
}

export function filterTask(message: string): TaskFilterResult {
  const lower = message.toLowerCase().trim();

  for (const keyword of BLOCKED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return {
        allowed: false,
        message: `Sorry, I can't handle that task. ${DOCUMENT_SUGGESTION}`,
      };
    }
  }

  if (lower.length < 2) {
    return {
      allowed: true,
      message: '',
    };
  }

  return { allowed: true, message: '' };
}
