import { ButtonHTMLAttributes } from 'react';
import { Preloader } from 'react-materialize';
import styles from './LoadingButton.module.scss';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLInputElement>{
  title: string;
  icon?: string;
  loading: boolean
}

const LoadingButton = ({ loading, title, icon = 'send' }:LoadingButtonProps) => (
  <div className={styles.formButtons}>

    <button className="btn waves-effect waves-light" type="submit" name="action">
      {!loading ? (
        <>
          { title }
          <i className="material-icons right">{icon}</i>
        </>
      )
        : (
          <Preloader
            active
            flashing={false}
            size="small"
          />
        )}
    </button>
  </div>
);

export default LoadingButton;
