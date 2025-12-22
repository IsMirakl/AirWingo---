/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { authAPI } from '../api';
import type { LoginData, User } from '../types/dto/user';

interface RegisterFormData {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   middleName?: string;
   birthday: string;
}
export const useAuth = () => {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const login = async (data: LoginData): Promise<boolean> => {
      setIsLoading(true);
      setError('');

      try {
         const response = await authAPI.login(data);
         setUser(response.user);
         return true;
      } catch (err: any) {
         setError(err.response?.data?.message || 'Error Input');
         return false;
      } finally {
         setIsLoading(false);
      }
   };

   const register = async (formData: RegisterFormData): Promise<boolean> => {
      setIsLoading(true);
      setError('');

      try {
         if (
            !formData.email ||
            !formData.password ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.birthday
         ) {
            setError('Заполните все обязательные поля');
            return false;
         }

         const birthDate = new Date(formData.birthday);

         if (isNaN(birthDate.getTime())) {
            setError('Некорректная дата рождения');
            return false;
         }

         const registerData = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName || '',
            birthday: formData.birthday,
            registrationDate: new Date(),
         };

         const response = await authAPI.register(registerData);

         setUser(response.user);
         return true;
      } catch (err: any) {
         let errorMessage = 'Ошибка регистрации';

         if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
         } else if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
         } else if (err.message) {
            errorMessage = err.message;
         }

         setError(errorMessage);
         return false;
      } finally {
         setIsLoading(false);
      }
   };

   const clearError = (): void => {
      setError('');
   };

   return {
      user,
      isLoading,
      error,
      login,
      register,
      clearError,
   };
};
