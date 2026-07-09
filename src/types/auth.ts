export type LoginMethod = 'spid-cie' | 'it-wallet';

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
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  initAuth: () => Promise<void>;
  login: (method?: LoginMethod) => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
}
