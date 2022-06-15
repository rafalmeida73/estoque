import type { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../../styles/AddDeposit.module.scss';
import { schema } from '../validations/addProviders';
import { TextInput } from '../components/TextInput';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';

interface AddDepositFormType{
  nome_fornecedor: string;
}

const AddProviders: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm<AddDepositFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = useCallback(async (data:AddDepositFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.post('/addProvider', data);
      toast.update(addToast, {
        render: 'Fornecedor adicionado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push('/fornecedores');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar fornecedor, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [reset, router]);

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Adicionar depósito
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextInput register={register} id="nome_fornecedor" errors={errors} icon="edit" label="Nome do fornecedor" />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Criar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default AddProviders;
