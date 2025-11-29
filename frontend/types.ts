export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface LogEntry {
  id: string;
  level: 'info' | 'error' | 'warning';
  message: string;
  timestamp: string;
  metadata?: any;
}