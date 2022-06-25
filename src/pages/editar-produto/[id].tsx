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
import { ProductsProps, useQuarkusContext } from '../../context/useQuarkus';

interface EditProductFormType{
  pr_nome: string;
  pr_preco: number;
  pr_quantidade: number;
  pr_categoria: string;
  pr_reposicao: number;
}

const EditProduct: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    products, getProducts,
  } = useQuarkusContext();

  const [isloading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductsProps>();

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
    if (product) {
      setValue('pr_nome', product?.pr_nome);
      setValue('pr_preco', product?.pr_preco);
      setValue('pr_quantidade', product?.pr_quantidade);
      setValue('pr_categoria', product?.pr_categoria);
      setValue('pr_reposicao', product?.pr_reposicao);
    }
  }, [product, setValue]);

  const loadProducts = useCallback(
    async () => {
      setIsLoading(true);
      try {
        await getProducts();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar produtos');
      } finally {
        setIsLoading(false);
      }
    },
    [getProducts],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setProduct(products.find((item) => item?.pr_id === Number(id)));
  }, [id, products]);

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

        <TextInput register={register} id="pr_nome" errors={errors} icon="edit" label="Nome do produto" defaultValue={product?.pr_nome} />
        <TextInput register={register} id="pr_preco" errors={errors} icon="attach_money" label="Preço" type="number" defaultValue={product?.pr_preco} />
        <TextInput register={register} id="pr_quantidade" errors={errors} icon="filter_1" label="Quantidade" type="number" defaultValue={product?.pr_quantidade} />
        <TextInput register={register} id="pr_categoria" errors={errors} icon="priority_high" label="Ponto de reposição" defaultValue={product?.pr_categoria} />
        <TextInput register={register} id="pr_reposicao" errors={errors} icon="priority_high" label="Ponto de reposição" type="number" defaultValue={product?.pr_reposicao} />

        <div className={styles.formButtons}>
          <LoadingButton type="submit" title="Editar" loading={isloading} />
        </div>
      </form>

    </main>
  );
};

export default EditProduct;
