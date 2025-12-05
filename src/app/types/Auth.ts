export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role:string;
  user: {
    id: string;
    name: string;
    role: string;
  };
}

