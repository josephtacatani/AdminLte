export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    data: Token;
  }

  export interface LoginResponseError{
    message: string;
  }
  
  export interface Token {
    accessToken: string;
    refreshToken?: string | null; // Optional since it's only needed for refreshing
  }


