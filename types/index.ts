
export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  plan: 'free' | 'pro' | 'enterprise';
  credits: number;
  emailVerified: boolean;
  createdAt: string; // Using string to represent timestamp from Firestore
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
