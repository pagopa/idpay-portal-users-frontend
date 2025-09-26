export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  attributes?: {
    dateOfBirth?: string[];
    fiscalNumber?: string[];
  }
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  initAuth: () => Promise<void>;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
}