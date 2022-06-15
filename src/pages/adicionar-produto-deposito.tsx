/* eslint-disable no-undef */
import type { NextPage } from 'next';
import Head from 'next/head';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../../styles/AddDeposit.module.scss';
import { schema } from '../validations/productInDeposit';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';
import { DepositsProps, ProductsProps } from './api/getlength';
import Loading from '../components/Loading';

interface AddProductInDepositType{
  id_deposito: number;
  id_produto: number;
}

const AddProductInDeposit: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductsProps[]>();
  const [deposits, setDeposits] = useState<DepositsProps[]>();

  const router = useRouter();

  const {
    handleSubmit, formState: { errors }, reset, control,
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
  const getDeposits = useCallback(async () => {
    try {
      const { data } = await api.get<DepositsProps[]>('/depositsList');
      setDeposits(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar o tamanhos');
    }
  }, []);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const onSubmit = handleSubmit(async (formData) => {
    const data = formData as AddProductInDepositType;
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/addProductInDeposit/${data.id_deposito}/${data.id_produto}`);
      toast.update(addToast, {
        render: 'Produto adicionado ao depósito com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push(`/deposito/${data.id_deposito}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar produto ao depósito, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
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

        <Controller
          name="id_produto"
          control={control}
          render={({ field }) => (
            <div className="input-field col s12">
              <select defaultValue="default" {...field}>
                <option value="default" disabled>Escolha o produto</option>
                {products?.map((product) => (
                  <option value={product.id_produto} key={product?.id_produto}>{product?.nome_produto}</option>
                ))}

              </select>
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_produto?.message}
        </p>

        <Controller
          name="id_deposito"
          control={control}
          render={({ field }) => (
            <div className="input-field col s12">
              <select defaultValue="default" {...field}>
                <option value="default" disabled>Escolha o depósito</option>
                {deposits?.map((deposit) => (
                  <option value={deposit?.id_deposito} key={deposit?.id_deposito}>{deposit?.nome_deposito}</option>
                ))}

              </select>
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_deposito?.message}
        </p>

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Adicionar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default AddProductInDeposit;
