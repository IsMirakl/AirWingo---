import { useState } from 'react';
import Modal from 'react-modal';
import { FormField } from '../ui/forms/FormField';

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

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const [registerData, setRegisterData] = useState({
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

      if (email) {
         setRegisterData(prev => ({ ...prev, email }));
      }
   };

   const handleRegisterChange = (field: string, value: string) => {
      setRegisterData(prev => ({ ...prev, [field]: value }));
   };

   const switchToLogin = () => {
      setIsLoginModal(true);

      setRegisterData(prev => ({
         ...prev,
         password: '',
         confirmPassword: '',
         firstName: '',
         lastName: '',
         birthday: '',
      }));
   };

   const resetForm = () => {
      setRegisterData({
         email: '',
         password: '',
         confirmPassword: '',
         firstName: '',
         lastName: '',
         middleName: '',
         birthday: '',
      });
   };

   const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
   };

   const handlePasswordInputChange = (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setPassword(e.target.value);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoginModal) {
         // login
      } else {
         // register
         if (password !== registerData.confirmPassword) {
            // return password no confirm
            return;
         }
      }

      closeModal();
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
                        value={email}
                        onChange={handleEmailInputChange}
                        required
                        className={componentStyles.emailField}
                     />
                     <FormField
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={handlePasswordInputChange}
                        required
                        className={componentStyles.passwordField}
                     />
                     {!isLoginModal && (
                        <>
                           <div className={componentStyles.nameRow}>
                              <FormField
                                 type="text"
                                 placeholder="Имя"
                                 value={registerData.firstName}
                                 onChange={e =>
                                    handleRegisterChange(
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
                                 value={registerData.lastName}
                                 onChange={e =>
                                    handleRegisterChange(
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
                                 value={registerData.middleName}
                                 onChange={e =>
                                    handleRegisterChange(
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
                              value={registerData.birthday}
                              onChange={e =>
                                 handleRegisterChange(
                                    'birthday',
                                    e.target.value
                                 )
                              }
                              required
                              className={componentStyles.passwordField}
                           />

                           <FormField
                              type="password"
                              placeholder="Подтвердите пароль"
                              value={registerData.confirmPassword}
                              onChange={e =>
                                 handleRegisterChange(
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
