export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
  created_at: Date;
}