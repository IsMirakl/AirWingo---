/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../ui/forms/FormField';

import { useAuth } from '../../hooks/useAuth';

import componentStyles from '../modals/AuthModal.module.css';

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root'); // Assuming your app mounts to a div with id 'root'

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

   const { login, register, isLoading } = useAuth();
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

   const openModal = () => setModalIsOpen(true);
   const closeModal = () => {
      setModalIsOpen(false);
      setIsLoginModal(true);
      resetForm();
   };

   const switchToRegister = () => {
      setIsLoginModal(false);
   };

   const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const switchToLogin = () => {
      setIsLoginModal(true);

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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isLoginModal) {
         if (formData.password !== formData.confirmPassword) {
            console.error('Пароли не совпадают');

            return;
         }
      }

      try {
         let success = false;
         if (isLoginModal) {
            success = await login({
               email: formData.email,
               password: formData.password,
            });
         } else {
            const { confirmPassword, ...registerData } = formData;
            success = await register(registerData);
         }

         if (success) {
            closeModal();
            navigate('/profile');
         }
      } catch (error) {
         console.error('Ошибка авторизации:', error);
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
                  <form
                     onSubmit={handleSubmit}
                     className={componentStyles.formAuth}
                  >
                     <FormField
                        type="email"
                        placeholder="Электронная почта"
                        value={formData.email}
                        onChange={e =>
                           handleInputChange('email', e.target.value)
                        }
                        required
                        className={componentStyles.emailField}
                     />
                     <FormField
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={e =>
                           handleInputChange('password', e.target.value)
                        }
                        required
                        className={componentStyles.passwordField}
                     />
                     {!isLoginModal && (
                        <>
                           <div className={componentStyles.nameRow}>
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
                              />
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
                              />
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

                           <FormField
                              type="date"
                              placeholder="Дата рождения"
                              value={formData.birthday}
                              onChange={e =>
                                 handleInputChange('birthday', e.target.value)
                              }
                              required
                              className={componentStyles.passwordField}
                           />

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
                           />
                        </>
                     )}

                     <button
                        type="submit"
                        className={componentStyles.buttonAuth}
                        disabled={isLoading}
                     >
                        {isLoginModal ? 'Войти' : 'Зарегистрироваться'}
                     </button>

                     <div className={componentStyles.links}>
                        {isLoginModal ? (
                           <>
                              <a href="#" onClick={switchToRegister}>
                                 Регистрация
                              </a>
                              <a href="#" onClick={e => e.preventDefault()}>
                                 Забыли пароль?
                              </a>
                           </>
                        ) : (
                           <a href="#" onClick={switchToLogin}>
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
