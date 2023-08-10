export interface IAuthState {
  expiresIn: number;
  token: string;
  isLoading: boolean;
  error: string | null;
  isAuth: boolean;
}
