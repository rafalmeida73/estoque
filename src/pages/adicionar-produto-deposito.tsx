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
import { schema } from '../validations/productInDeposit';
import LoadingButton from '../components/LoadingButton';
import { api } from '../services/api';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';
import withAuth from '../logic/auth';

export interface AddProductInDepositType{
  id_deposito: {value: number, label: number};
  id_produto: {value: number, label: number};
  tipo: {value: string, label: string};
}

const AddProductInDeposit: NextPage = () => {
  const [isloading, setIsLoading] = useState(false);

  const {
    deposits, getDeposits, getProducts, products,
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
        await getDeposits();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar os produtos ou depósito');
      } finally {
        setIsLoading(false);
      }
    },
    [getDeposits, getProducts],
  );

  const onSubmit = handleSubmit(async (formData) => {
    const data = formData as AddProductInDepositType;

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/addProductInDeposit/${data.id_deposito.value}/${data.id_produto.value}/${data.tipo.value}`);
      toast.update(addToast, {
        render: 'Produto adicionado ao depósito com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push(`/deposito/${data.id_deposito.value}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar adicionar produto ao depósito, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    }
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const productsOptions = useMemo(() => (products.map((product) => ({ value: product?.pr_id, label: product?.pr_nome }))), [products]);
  const depositsOptions = useMemo(() => (deposits.map((deposit) => ({ value: deposit?.de_id, label: deposit?.de_nome }))), [deposits]);
  const typeOptions = [
    { value: 'doacao', label: 'Por doação' },
    { value: '', label: 'Nota fiscal' },
  ];
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
            <Select
              options={productsOptions}
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
              placeholder="Selecione o produto"
              {...field}
            />
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
              <Select
                options={depositsOptions}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                placeholder="Selecione o depósito"
                {...field}
              />
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_deposito?.message}
        </p>

        <Controller
          name="tipo"
          control={control}
          render={({ field }) => (
            <div className="input-field col s12">
              <Select
                options={typeOptions}
                styles={{
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                }}
                placeholder="Tipo"
                {...field}
              />
            </div>
          )}
        />

        <p className="errorLabel">
          {errors?.id_deposito?.message}
        </p>

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Adicionar produto" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default withAuth(AddProductInDeposit);
