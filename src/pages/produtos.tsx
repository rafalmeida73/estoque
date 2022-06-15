import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Products.module.scss';
import Loading from '../components/Loading';
import { api } from '../services/api';
import { ProductsProps } from './api/getlength';

const Products = () => {
  const [products, setProducts] = useState<ProductsProps[]>();

  const getDeposits = useCallback(async () => {
    try {
      const { data } = await api.get<ProductsProps[]>('/products');
      setProducts(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar os produtos');
    }
  }, []);

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
    getDeposits();
  }, [getDeposits]);

  if (!products) {
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
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ponto de reposição</th>
              </tr>
            </thead>

            <tbody>
              {products?.map((product) => (
                <tr key={product?.id_produto}>
                  <td>
                    <Link href={`/produto/${product?.id_produto}`}>
                      <p>
                        {product?.id_produto}
                      </p>
                    </Link>
                  </td>
                  <td>{product?.nome_produto}</td>
                  <td>{price(product?.preco)}</td>
                  <td>{product?.quantidade_produto}</td>
                  <td>{product?.pontoReposicao_produto}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </main>
      </div>
    </>
  );
};

export default Products;
