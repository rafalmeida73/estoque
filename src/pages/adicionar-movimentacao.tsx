/* eslint-disable no-undef */
import type { NextPage } from 'next';
import Head from 'next/head';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../../styles/AddDeposit.module.scss';
import { schema } from '../validations/AddMovement';
import { TextInput } from '../components/TextInput';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';
import { ProductsProps } from './api/getlength';
import Loading from '../components/Loading';

interface AddMovementType{
  tipo_movimentacao: string;
  quantidade_movimentacao: number;
  produto: string
}

const AddMovement: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsProps[]>();
  const router = useRouter();

  const {
    register, handleSubmit, formState: { errors }, reset, control,
  } = useForm({
    resolver: yupResolver(schema()),
  });

  const getProducts = useCallback(async () => {
    try {
      const { data } = await api.get<ProductsProps[]>('/products');
      setProducts(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar os produtos');
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const onSubmit = handleSubmit(async (formData) => {
    const data = formData as AddMovementType;
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    const response = {
      tipo_movimentacao: data.tipo_movimentacao,
      quantidade_movimentacao: data.quantidade_movimentacao,
      produto: JSON.parse(data.produto),
    };

    try {
      await api.post('/addMovement', response);
      toast.update(addToast, {
        render: 'Movimentação adicionado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push('/movimentacoes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar movimentação, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    const selectElems = document.querySelectorAll('select');

    M.FormSelect.init(selectElems);
  });

  if (!products) {
    return <Loading />;
  }

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Adicionar depósito
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={onSubmit}>

        <TextInput register={register} id="tipo_movimentacao" errors={errors} icon="edit" label="Tipo de movimentação" />
        <TextInput register={register} id="quantidade_movimentacao" errors={errors} icon="filter_1" label="Quantidade" type="number" />

        <Controller
          name="produto"
          control={control}
          render={({ field }) => (
            <div className="input-field col s12">
              <select defaultValue="default" {...field}>
                <option value="default" disabled>Escolha o produto</option>
                {products?.map((product) => (
                  <option value={JSON.stringify(product)} key={product?.id_produto}>{product?.nome_produto}</option>
                ))}

              </select>
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.position?.message}
        </p>

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Criar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default AddMovement;
