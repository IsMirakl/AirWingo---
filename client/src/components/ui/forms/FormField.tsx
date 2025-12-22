interface FormFieldProps {
   type: string;
   name?: string;
   placeholder: string;
   value: string;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   required?: boolean;
   className?: string;
   onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
   hasError?: boolean;
}

export const FormField = ({
   type,
   name,
   placeholder,
   value,
   onChange,
   required = false,
   className = '',
   onFocus,
   hasError = false,
}: FormFieldProps) => {
   return (
      <input
         type={type}
         name={name}
         placeholder={placeholder}
         value={value}
         onChange={onChange}
         required={required}
         className={className}
         onFocus={onFocus}
         hasError={hasError}
      />
   );
};
