import type { NextPage } from 'next';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useCallback, useEffect, useState,
} from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import styles from '../../../styles/AddDeposit.module.scss';
import { schema } from '../../validations/editDeposiit';
import { TextInput } from '../../components/TextInput';
import LoadingButton from '../../components/LoadingButton';
import { api } from '../../services/api';
import { DepositsProps, useQuarkusContext } from '../../context/useQuarkus';
import withAuth from '../../logic/auth';

interface EditDepositoFormType{
  de_nome: string;
}

const EditDeposit: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    deposits, getDeposits,
  } = useQuarkusContext();

  const [isloading, setIsLoading] = useState(false);
  const [deposit, setDeposit] = useState<DepositsProps>();

  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm<EditDepositoFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = useCallback(async (data:EditDepositoFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/editDeposit/${id}`, data);
      toast.update(addToast, {
        render: 'Depósito editado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push(`/deposito/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar editar depósito, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, reset, router]);

  useEffect(() => {
    if (deposit) {
      setValue('de_nome', deposit?.de_nome);
    }
  }, [deposit, setValue]);

  const loadDeposits = useCallback(
    async () => {
      setIsLoading(true);
      try {
        await getDeposits();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar depósitos');
      } finally {
        setIsLoading(false);
      }
    },
    [getDeposits],
  );

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  useEffect(() => {
    setDeposit(deposits.find((item) => item?.de_id === Number(id)));
  }, [deposits, id]);

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Editar depósito
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextInput register={register} id="de_nome" errors={errors} icon="edit" label="Nome" defaultValue={deposit?.de_nome} />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Editar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default withAuth(EditDeposit);
