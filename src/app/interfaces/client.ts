export interface Client {
  id: number;
  userName: string;
  lastName?: string;
  password?: string;
  email: string;
  role: string;
  sexe?: string;
  phone?: string;
}
