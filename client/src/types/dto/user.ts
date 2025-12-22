export type status = 'user' | 'admin';

export interface User {
   id: number;
   firstName: string;
   lastName: string;
   middleName?: string;
   status: status;
   birthday: string;
}

export interface LoginData {
   email: string;
   password: string;
}

export interface RegisterData {
   firstName: string;
   lastName: string;
   middleName: string;
   registrationDate: Date;
   email: string;
   password: string;
   birthday: string;
}

export interface AuthResponse {
   user: User;
   accessToken: string;
}
