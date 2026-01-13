export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin" | "manager";
  email_verified_at?: string;
  is_blocked?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
