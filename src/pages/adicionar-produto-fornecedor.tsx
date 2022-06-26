/* eslint-disable no-undef */
import type { NextPage } from 'next';
import Head from 'next/head';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Select from 'react-select';
import styles from '../../styles/AddDeposit.module.scss';
import { schema } from '../validations/productInProvider';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';
import withAuth from '../logic/auth';

export interface AddProductInDepositType{
  id_fornecedor: {value: number, label: number};
  id_produto: {value: number, label: number};
}

const AddProductInProvider: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);

  const {
    providers, getProviders, getProducts, products,
  } = useQuarkusContext();

  const router = useRouter();

  const {
    handleSubmit, formState: { errors }, reset, control,
  } = useForm({
    resolver: yupResolver(schema()),
  });

  const loadData = useCallback(
    async () => {
      setIsLoading(true);
      try {
        await getProducts();
        await getProviders();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar os produtos ou depósito');
      } finally {
        setIsLoading(false);
      }
    },
    [getProviders, getProducts],
  );

  const onSubmit = handleSubmit(async (formData) => {
    const data = formData as AddProductInDepositType;

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/addProductInProvider/${data.id_fornecedor.value}/${data.id_produto.value}`);
      toast.update(addToast, {
        render: 'Produto adicionado ao fornecedor com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();

      await getProviders();

      router.push(`/deposito/${data.id_fornecedor.value}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar produto ao fornecedor, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    }
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const productsOptions = useMemo(() => (products.map((product) => ({ value: product?.pr_id, label: product?.pr_nome }))), [products]);
  const providersOptions = useMemo(() => (providers.map((provider) => ({ value: provider?.fo_id, label: provider?.fo_nome }))), [providers]);

  if (isloading) {
    return <Loading />;
  }

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Adicionar produto ao depósito
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
              <Select
                options={productsOptions}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                placeholder="Selecione o produto"
                {...field}
              />
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_produto?.message}
        </p>

        <Controller
          name="id_fornecedor"
          control={control}
          render={({ field }) => (
            <div className="input-field col s12">
              <Select
                options={providersOptions}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                placeholder="Selecione o fornecedor"
                {...field}
              />
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_fornecedor?.message}
        </p>

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Adicionar produto" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default withAuth(AddProductInProvider);
