import React, {
  InputHTMLAttributes, useCallback,
} from 'react';
import { UseFormRegister } from 'react-hook-form';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>{
  icon: string;
  id: string;
  label: string;
  errors?: {
    [x: string]: any;
  };
  register?: UseFormRegister<any>;
  type?: string;
  isDate?: boolean;
  isTelephone?: boolean;
  isEmail?: boolean
  defaultValue?: string
}

export const TextInput = ({
  icon, id, label, errors, register, type = 'text', isDate, isTelephone, isEmail, defaultValue, ...rest
}:TextInputProps) => {
  const maskDate = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const { value } = e.currentTarget;

      if (isTelephone) {
        e.currentTarget.value = value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d{4})(\d)/, '$1-$2');
      }

      if (isEmail) {
        e.currentTarget.value = e.currentTarget.value.trim();
      }
    },
    [isEmail, isTelephone],
  );

  return (
    <div>
      <div className="input-field">
        <i className="material-icons prefix">{icon}</i>
        <input id={id} type={type} className="validate" {...register?.(id)} {...rest} onKeyUp={maskDate} defaultValue={defaultValue} />
        <label htmlFor={id} className={defaultValue ? 'active' : ''}>{label}</label>
      </div>

      {errors?.[id]?.message && (
      <p className="errorLabel">
        {errors?.[id]?.message}
      </p>
      )}
    </div>
  );
};
