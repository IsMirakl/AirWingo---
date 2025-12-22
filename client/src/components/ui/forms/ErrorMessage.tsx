import styles from './FormFieldComponent.module.css';

interface ErrorMessageProps {
   message: string;
   type?: 'error' | 'warning' | 'success';
}

export const ErrorMessage = ({
   message,
   type = 'error',
}: ErrorMessageProps) => {
   if (!message) return null;

   return (
      <div className={`${styles.errorMessage} ${styles[type]}`}>{message}</div>
   );
};
