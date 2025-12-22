/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import componentStyles from '../modals/AuthModal.module.css';
import { ErrorMessage } from '../ui/forms/ErrorMessage';
import { FormField } from '../ui/forms/FormField';

Modal.setAppElement('#root');

const customStyles = {
   content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 0 5px 0 #0f4d8a',
      padding: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '12px',
   },
   overlay: {
      backgroundColor: '#2c3959b7',
   },
};

function AppModal() {
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [isLoginModal, setIsLoginModal] = useState(true);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [serverError, setServerError] = useState<string>('');

   const { login, register, isLoading, error } = useAuth();
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      middleName: '',
      birthday: '',
   });

   useEffect(() => {
      if (error) {
         setServerError(error);
      }
   }, [error]);

   const openModal = () => setModalIsOpen(true);

   const closeModal = () => {
      setModalIsOpen(false);
      setIsLoginModal(true);
      setErrors({});
      setServerError('');
      resetForm();
   };

   const switchToRegister = () => {
      setIsLoginModal(false);
      setErrors({});
      setServerError('');
   };

   const switchToLogin = () => {
      setIsLoginModal(true);
      setErrors({});
      setServerError('');
      setFormData(prev => ({
         ...prev,
         confirmPassword: '',
         firstName: '',
         lastName: '',
         middleName: '',
         birthday: '',
      }));
   };

   const resetForm = () => {
      setFormData({
         email: '',
         password: '',
         confirmPassword: '',
         firstName: '',
         lastName: '',
         middleName: '',
         birthday: '',
      });
   };

   const validateForm = (): boolean => {
      const newErrors: Record<string, string> = {};

      if (!formData.email) {
         newErrors.email = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         newErrors.email = 'Некорректный email';
      }

      if (!formData.password) {
         newErrors.password = 'Пароль обязателен';
      } else if (formData.password.length < 8) {
         newErrors.password = 'Пароль должен быть не менее 8 символов';
      }

      if (!isLoginModal) {
         if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
         }

         if (!formData.firstName) {
            newErrors.firstName = 'Имя обязательно';
         }

         if (!formData.lastName) {
            newErrors.lastName = 'Фамилия обязательна';
         }

         if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (age <= 14) {
               newErrors.birthday = 'Возраст должен быть не младше 14 лет';
            }
         }
      }

      setErrors(newErrors);
      setServerError('');
      return Object.keys(newErrors).length === 0;
   };

   const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      if (errors[field]) {
         setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
         });
      }

      if (serverError) {
         setServerError('');
      }
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      try {
         let success = false;
         if (isLoginModal) {
            success = await login({
               email: formData.email,
               password: formData.password,
            });
         } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...registerData } = formData;
            success = await register(registerData);
         }

         if (success) {
            closeModal();
            navigate('/profile');
         }
      } catch (error) {
         console.error('Ошибка авторизации:', error);
         setServerError(
            error instanceof Error ? error.message : 'Произошла ошибка'
         );
      }
   };

   return (
      <div>
         <button onClick={openModal}>Профиль</button>
         <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Auth Modal"
            style={customStyles}
         >
            <div className={componentStyles.modalContent}>
               <div className={componentStyles.formContainer}>
                  <h2 className={componentStyles.h2}>
                     {isLoginModal
                        ? 'Вход в личный кабинет'
                        : 'Регистрация профиля'}
                  </h2>
                  <hr className={componentStyles.divider} />

                  {serverError && (
                     <ErrorMessage message={serverError} type="error" />
                  )}

                  <form
                     onSubmit={handleSubmit}
                     className={componentStyles.formAuth}
                  >
                     <div>
                        <FormField
                           type="email"
                           placeholder="Электронная почта"
                           value={formData.email}
                           onChange={e =>
                              handleInputChange('email', e.target.value)
                           }
                           required
                           className={componentStyles.emailField}
                           hasError={!!errors.email}
                        />
                        {errors.email && (
                           <ErrorMessage message={errors.email} />
                        )}
                     </div>

                     <div>
                        <FormField
                           type="password"
                           placeholder="Пароль"
                           value={formData.password}
                           onChange={e =>
                              handleInputChange('password', e.target.value)
                           }
                           required
                           className={componentStyles.passwordField}
                           hasError={!!errors.password}
                        />
                        {errors.password && (
                           <ErrorMessage message={errors.password} />
                        )}
                     </div>

                     {!isLoginModal && (
                        <>
                           <div className={componentStyles.nameRow}>
                              <div>
                                 <FormField
                                    type="text"
                                    placeholder="Имя"
                                    value={formData.firstName}
                                    onChange={e =>
                                       handleInputChange(
                                          'firstName',
                                          e.target.value
                                       )
                                    }
                                    required
                                    className={componentStyles.nameField}
                                    hasError={!!errors.firstName}
                                 />
                                 {errors.firstName && (
                                    <ErrorMessage message={errors.firstName} />
                                 )}
                              </div>

                              <div>
                                 <FormField
                                    type="text"
                                    placeholder="Фамилия"
                                    value={formData.lastName}
                                    onChange={e =>
                                       handleInputChange(
                                          'lastName',
                                          e.target.value
                                       )
                                    }
                                    required
                                    className={componentStyles.nameField}
                                    hasError={!!errors.lastName}
                                 />
                                 {errors.lastName && (
                                    <ErrorMessage message={errors.lastName} />
                                 )}
                              </div>

                              <div>
                                 <FormField
                                    type="text"
                                    placeholder="Отчество"
                                    value={formData.middleName}
                                    onChange={e =>
                                       handleInputChange(
                                          'middleName',
                                          e.target.value
                                       )
                                    }
                                    className={componentStyles.passwordField}
                                 />
                              </div>
                           </div>

                           <div>
                              <FormField
                                 type="date"
                                 placeholder="Дата рождения"
                                 value={formData.birthday}
                                 onChange={e =>
                                    handleInputChange(
                                       'birthday',
                                       e.target.value
                                    )
                                 }
                                 required
                                 className={componentStyles.passwordField}
                                 hasError={!!errors.birthday}
                              />
                              {errors.birthday && (
                                 <ErrorMessage message={errors.birthday} />
                              )}
                           </div>

                           <div>
                              <FormField
                                 type="password"
                                 placeholder="Подтвердите пароль"
                                 value={formData.confirmPassword}
                                 onChange={e =>
                                    handleInputChange(
                                       'confirmPassword',
                                       e.target.value
                                    )
                                 }
                                 required
                                 className={componentStyles.passwordField}
                                 hasError={!!errors.confirmPassword}
                              />
                              {errors.confirmPassword && (
                                 <ErrorMessage
                                    message={errors.confirmPassword}
                                 />
                              )}
                           </div>
                        </>
                     )}

                     <button
                        type="submit"
                        className={componentStyles.buttonAuth}
                        disabled={isLoading}
                     >
                        {isLoading
                           ? 'Загрузка...'
                           : isLoginModal
                           ? 'Войти'
                           : 'Зарегистрироваться'}
                     </button>

                     <div className={componentStyles.links}>
                        {isLoginModal ? (
                           <>
                              <a
                                 href="#"
                                 onClick={e => {
                                    e.preventDefault();
                                    switchToRegister();
                                 }}
                              >
                                 Регистрация
                              </a>
                              <a href="#" onClick={e => e.preventDefault()}>
                                 Забыли пароль?
                              </a>
                           </>
                        ) : (
                           <a
                              href="#"
                              onClick={e => {
                                 e.preventDefault();
                                 switchToLogin();
                              }}
                           >
                              Уже есть аккаунт? Войти
                           </a>
                        )}
                     </div>
                  </form>
               </div>
            </div>
         </Modal>
      </div>
   );
}

export default AppModal;
