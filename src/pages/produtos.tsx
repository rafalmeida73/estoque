import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Products.module.scss';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';
import withAuth from '../logic/auth';

const Products = () => {
  const [loading, setLoading] = useState(false);

  const {
    products, getProducts,
  } = useQuarkusContext();

  const loadProducts = useCallback(
    async () => {
      setLoading(true);
      try {
        await getProducts();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar os produtos');
      } finally {
        setLoading(false);
      }
    },
    [getProducts],
  );

  const price = useCallback((value: number) => {
    if (value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }

    return 'R$ 0';
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Produtos
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container} container`}>
        <main>
          <div className={styles.title}>
            <p>Produtos</p>
            <Link href="/adicionar-produto" title="Adicionar produto">
              <Icon small>
                add
              </Icon>
            </Link>
          </div>

          <table className="striped highlight centered ">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Nome</th>
                <th>Precisa repor?</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ponto de reposição</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr key={product?.pr_id}>
                  <td>
                    <Link href={`/produto/${product?.pr_id}`}>
                      <p>
                        {product?.pr_id}
                      </p>
                    </Link>
                  </td>
                  <td>{product?.pr_nome}</td>
                  <td>{product?.pr_pont_repo ? 'Sim' : 'Não'}</td>
                  <td>{price(product?.pr_preco)}</td>
                  <td>{product?.pr_quantidade}</td>
                  <td>{product?.pr_reposicao}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </main>
      </div>
    </>
  );
};

export default withAuth(Products);
