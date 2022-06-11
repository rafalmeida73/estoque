import { InputHTMLAttributes, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Icon } from 'react-materialize';
import styles from './Passwordnput.module.scss';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement>{
  id: string;
  label: string;
  errors?: {
    [x: string]: any;
  };
  register?: UseFormRegister<any>;
  icon?: string
}

export const PasswordInput = ({
  label, errors, id, register, icon = 'lock', ...rest
}:PasswordInputProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className={styles.container}>
      <div className="input-field col s6">
        <i className="material-icons prefix">{icon}</i>
        <input id={id} type={visible ? 'password' : 'text'} className="validate" {...register?.(id)} {...rest} />
        <label htmlFor={id}>{label}</label>
        <button type="button" onClick={() => setVisible(!visible)}>
          {visible
            ? <Icon>visibility</Icon>
            : <Icon>visibility_off</Icon>}
        </button>
      </div>

      {errors?.[id]?.message && (
      <p className="errorLabel">
        {errors?.[id]?.message}
      </p>
      )}
    </div>
  );
};
