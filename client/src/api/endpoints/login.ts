import type {
   AuthResponse,
   LoginData,
   Profile,
   RegisterData,
} from '../../types/dto/user';
import { api } from '../axiosConfig';

export const authAPI = {
   login: async (data: LoginData): Promise<AuthResponse> => {
      const response = await api.post('/v1/auth/login', data);
      localStorage.setItem('accessToken', response.data.accessTokend);
      return response.data;
   },

   register: async (data: RegisterData): Promise<AuthResponse> => {
      const response = await api.post('/v1/auth/register', data);
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data;
   },

   //    refreshToken: async (): Promise<{ accessToken: string }> => {
   //       const response = await api.post('/auth/token/refresh');
   //       localStorage.setItem('accessToken', response.data.accessToken);
   //       return response.data;
   //    },

   getProfile: async (): Promise<Profile> => {
      const response = await api.get('/v1/auth/profile');
      return response.data;
   },
};

export const getAuthHeader = () => {
   const token = localStorage.getItem('accessToken');
   return token ? { Authorization: `Bearer ${token}` } : {};
};
