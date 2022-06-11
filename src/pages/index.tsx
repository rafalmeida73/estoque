import type { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.scss';
import { schema } from '../validations/login';
import { TextInput } from '../components/TextInput';
import { PasswordInput } from '../components/PasswordInput';
import LoadingButton from '../components/LoadingButton';
import animationData from '../../public/logo.json';

interface LoginFormType{
  email: string;
  password: string;
}

const Home: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const anime = useRef<HTMLDivElement>(null);

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm<LoginFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = async (data:LoginFormType) => {
    setIsLoading(true);
    console.log(data);
    router.push('menu');
    reset();
  };

  useEffect(() => {
    if (anime.current) {
      lottie.loadAnimation({
        container: anime.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData,
      });
    }

    return () => lottie.stop();
  }, []);

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Login
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextInput register={register} id="email" errors={errors} icon="account_circle" label="E-mail" isEmail />

        <PasswordInput label="Senha" register={register} id="password" errors={errors} />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Entrar" loading={isloading} />
        </div>
      </form>

      <div ref={anime} className={styles.lottie} />

    </main>
  );
};

export default Home;
