import type { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import { schema } from '../validations/login';
import { TextInput } from '../components/TextInput';
import { PasswordInput } from '../components/PasswordInput';
import LoadingButton from '../components/LoadingButton';
import animationData from '../../public/logo.json';
import { useQuarkusContext } from '../context/useQuarkus';

interface LoginFormType{
  email: string;
  password: string;
}

const Home: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    users, getUsers,
  } = useQuarkusContext();

  const { data: session } = useSession();

  const anime = useRef<HTMLDivElement>(null);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = async (data:LoginFormType) => {
    setIsLoading(true);

    const user = users.find((item) => item.email === data.email && item.senha === data.password);

    if (user) {
      toast.success('Bem-vindo(a)');

      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      return;
    }

    toast.error('Usuário não encontrado. Por favor, verifique o e-mail digitado e tente novamente');

    setIsLoading(false);
  };

  useEffect(() => {
    if (session) {
      router.push('/menu');
    }
  }, [router, session]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

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
    <main className={`${styles.container} `}>
      <Head>
        <title>
          Login
          {' '}
          | Estoque
        </title>
      </Head>
      <div className="container">
        <div className="row">
          <section className="col s12 m6 l6">
            <form onSubmit={handleSubmit(onSubmit)}>

              <TextInput register={register} id="email" errors={errors} icon="account_circle" label="E-mail" isEmail />

              <PasswordInput label="Senha" register={register} id="password" errors={errors} />

              <div className={styles.formButtons}>
                <LoadingButton type="submit" title="Entrar" loading={isloading} />
              </div>
            </form>
          </section>
          <section className="col s12 m6 l6">
            <Image src="/box.png" height="550" width="596" alt="Caixa de papelão" />
          </section>
        </div>

      </div>

    </main>
  );
};

export default Home;
