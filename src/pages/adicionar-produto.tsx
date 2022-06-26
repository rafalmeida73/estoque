import type { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../../styles/AddDeposit.module.scss';
import { schema } from '../validations/addProduct';
import { TextInput } from '../components/TextInput';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';
import withAuth from '../logic/auth';

interface AddProductFormType{
  pr_nome: string;
  pr_preco: number;
  pr_quantidade: number;
  pr_categoria: string;
  pr_reposicao: number;
}

const AddProduct: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register, handleSubmit, formState: { errors }, reset,
  } = useForm<AddProductFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = useCallback(async (data:AddProductFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.post('/addProduct', data);
      toast.update(addToast, {
        render: 'Produto adicionado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push('/produtos');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar produto, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [reset, router]);

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Adicionar produto
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextInput register={register} id="pr_nome" errors={errors} icon="edit" label="Nome do produto" />
        <TextInput register={register} id="pr_preco" errors={errors} icon="attach_money" label="Preço" type="number" />
        <TextInput register={register} id="pr_quantidade" errors={errors} icon="filter_1" label="Quantidade" type="number" />
        <TextInput register={register} id="pr_categoria" errors={errors} icon="priority_high" label="Categoria" />
        <TextInput register={register} id="pr_reposicao" errors={errors} icon="priority_high" label="Ponto de reposição" type="number" />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Criar produto" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default withAuth(AddProduct);
