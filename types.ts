
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}
