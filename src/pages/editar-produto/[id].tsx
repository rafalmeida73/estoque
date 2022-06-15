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
import { schema } from '../../validations/addProduct';
import { TextInput } from '../../components/TextInput';
import LoadingButton from '../../components/LoadingButton';
import { api } from '../../services/api';
import { ProductsProps } from '../api/getlength';

interface EditProductFormType{
  nome_produto: string;
  preco: number;
  quantidade_produto: number;
  pontoReposicao_produto: number;
}

const EditProduct: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;
  const [isloading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductsProps>();

  const getProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<ProductsProps>(`/product/${id}`);
      setProduct(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const {
    register, handleSubmit, formState: { errors }, reset, setValue,
  } = useForm<EditProductFormType>({
    resolver: yupResolver(schema()),
  });

  const onSubmit = useCallback(async (data:EditProductFormType) => {
    setIsLoading(true);

    const addToast = toast.loading('Carregando...');

    try {
      await api.put(`/editProduct/${id}`, data);
      toast.update(addToast, {
        render: 'Produto editado com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      reset();
      router.push(`/produto/${id}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um erro ao tentar editar produto, tente novamente', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, reset, router]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  useEffect(() => {
    if (product) {
      setValue('nome_produto', product?.nome_produto);
      setValue('preco', product?.preco);
      setValue('quantidade_produto', product?.quantidade_produto);
      setValue('pontoReposicao_produto', product?.pontoReposicao_produto);
    }
  }, [product, setValue]);

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

        <TextInput register={register} id="nome_produto" errors={errors} icon="edit" label="Nome do produto" defaultValue={product?.nome_produto} />
        <TextInput register={register} id="preco" errors={errors} icon="attach_money" label="Preço" type="number" defaultValue={product?.preco} />
        <TextInput register={register} id="quantidade_produto" errors={errors} icon="filter_1" label="Quantidade" type="number" defaultValue={product?.quantidade_produto} />
        <TextInput register={register} id="pontoReposicao_produto" errors={errors} icon="priority_high" label="Ponto de reposição" type="number" defaultValue={product?.pontoReposicao_produto} />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Editar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default EditProduct;
