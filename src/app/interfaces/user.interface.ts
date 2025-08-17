export interface UserDto {
  id?: number;
  userName: string;
  name: string;
  email: string;
  password?: string;
  address?: string;
  status?: string;   // "active" | "inactive"
  contact?: string;
  role?: string;     // "user" | "admin"
}
