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
import { schema } from '../../validations/addProviders';
import { TextInput } from '../../components/TextInput';
import LoadingButton from '../../components/LoadingButton';
import { api } from '../../services/api';
import { ProvidersProps, useQuarkusContext } from '../../context/useQuarkus';

interface EditProviderFormType{
  fo_nome: string;
}

const EditProvider: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    providers, getProviders,
  } = useQuarkusContext();

  const [isloading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<ProvidersProps>();

  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm<EditProviderFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = useCallback(async (data:EditProviderFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/editProvider/${id}`, data);
      toast.update(addToast, {
        render: 'Fornecedor editado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();

      await getProviders();

      router.push(`/fornecedor/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar editar fornecedor, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [getProviders, id, reset, router]);

  useEffect(() => {
    if (provider) {
      setValue('fo_nome', provider?.fo_nome);
    }
  }, [provider, setValue]);

  const loadProvider = useCallback(
    async () => {
      setIsLoading(true);
      try {
        await getProviders();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar depósitos');
      } finally {
        setIsLoading(false);
      }
    },
    [getProviders],
  );

  useEffect(() => {
    loadProvider();
  }, [loadProvider]);

  useEffect(() => {
    setProvider(providers.find((item) => item?.fo_id === Number(id)));
  }, [id, providers]);

  return (
    <main className={`${styles.container} container`}>
      <Head>
        <title>
          Editar fornecedor
          {' '}
          | Estoque
        </title>
      </Head>

      <form onSubmit={handleSubmit(onSubmit)}>

        <TextInput register={register} id="fo_nome" errors={errors} icon="edit" label="Nome do fornecedor" defaultValue={provider?.fo_nome} />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Editar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default EditProvider;
