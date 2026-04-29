const SIMPLE_TASKS = ['summarize', 'format', 'translate'];
const COMPLEX_TASKS = ['generate', 'edit'];

export function selectModel(task: string): string {
  if (SIMPLE_TASKS.includes(task)) {
    return 'deepseek-chat';
  }
  
  if (COMPLEX_TASKS.includes(task)) {
    return 'deepseek-chat';
  }
  
  return 'deepseek-chat';
}

export function selectAdvancedModel(task: string): string {
  if (task === 'edit' || task === 'generate') {
    return 'deepseek-coder';
  }
  
  return 'deepseek-chat';
}