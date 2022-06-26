import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Icon,
} from 'react-materialize';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Loading from '../../components/Loading';
import { api } from '../../services/api';
import styles from '../../../styles/Product.module.scss';
import { ProductsProps, useQuarkusContext } from '../../context/useQuarkus';
import withAuth from '../../logic/auth';

const Product: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    products, getProducts,
  } = useQuarkusContext();

  const [product, setProduct] = useState<ProductsProps>();
  const [loading, setLoading] = useState(false);

  const price = useCallback((value: number) => {
    if (value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }

    return 'R$ 0';
  }, []);

  const handleDeleteProduct = useCallback(async () => {
    const addToast = toast.loading('Carregando...');

    try {
      setLoading(true);
      await api.delete(`deleteProduct/${id}`);

      toast.update(addToast, {
        render: 'Produto removido  com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getProducts();

      router.push('/produtos');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover o produto, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getProducts, id, router]);

  const loadProducts = useCallback(
    async () => {
      setLoading(true);
      try {
        await getProducts();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar produtos');
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Produto
          {' '}
          {id}
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container} container`}>
        <main>
          <div className="row">
            <div className={`col s12 ${styles.card}`}>
              <div className="card darken-1">
                <div className="card-content ">
                  <section>
                    <h1 className="card-title">
                      Produto:
                      {' '}
                      {id}
                    </h1>

                    <div>
                      <button type="button" onClick={handleDeleteProduct} title="Deletar">
                        <Icon>delete</Icon>
                      </button>
                      <Link href={`/editar-produto/${id}`} title="Editar">
                        <Icon>edit</Icon>
                      </Link>
                    </div>
                  </section>
                  <div className={styles.info}>
                    <p>
                      Nome:
                    </p>
                    <span>
                      {' '}
                      {product?.pr_nome}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Precisa repor:
                    </p>
                    <span>
                      {' '}
                      {product?.pr_pont_repo ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Ponto de reposição:
                    </p>
                    <span>
                      {' '}
                      {product?.pr_reposicao}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Preço:
                    </p>
                    <span>
                      {' '}
                      {price(product?.pr_preco || 0)}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Quantidade:
                    </p>
                    <span>
                      {' '}
                      {product?.pr_quantidade}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default withAuth(Product);
