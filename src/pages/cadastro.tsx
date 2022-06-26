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
import styles from '../../styles/Register.module.scss';
import { schema } from '../validations/register';
import { TextInput } from '../components/TextInput';
import { PasswordInput } from '../components/PasswordInput';
import LoadingButton from '../components/LoadingButton';
import animationData from '../../public/logo.json';
import { useQuarkusContext } from '../context/useQuarkus';
import { api } from '../services/api';

interface LoginFormType{
  email: string;
  senha: string;
}

const Register: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    users, getUsers,
  } = useQuarkusContext();

  const { status } = useSession();

  const anime = useRef<HTMLDivElement>(null);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = async (data:LoginFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');
    const checkUser = users.find((item) => item.email === data.email);

    if (checkUser) {
      toast.update(addToast, {
        render: 'Já exite um usuário com esse e-mail', type: 'error', isLoading: false, autoClose: 5000,
      });

      setIsLoading(false);

      return;
    }

    try {
      await api.post('/addUser', data);

      await getUsers();

      toast.success('Bem-vindo(a)');

      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.senha,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Erro ao tentar fazer cadastro. Por favor, verifique o e-mail digitado e tente novamente');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/menu');
    }
  }, [router, status]);

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

              <PasswordInput label="Senha" register={register} id="senha" errors={errors} />

              <div className={styles.formButtons}>
                <LoadingButton type="submit" title="Cadastrar" loading={isloading} />
              </div>
            </form>
          </section>
          <section className="col s12 m6 l6">
            <Image src="/boxRegister.png" height="600" width="1000" alt="Caixa de papelão encima de uma esteira" />
          </section>
        </div>

      </div>

    </main>
  );
};

export default Register;
