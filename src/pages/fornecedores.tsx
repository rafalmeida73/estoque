import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Providers.module.scss';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';
import withAuth from '../logic/auth';

const Providers = () => {
  const [loading, setLoading] = useState(false);

  const {
    providers, getProviders,
  } = useQuarkusContext();

  const loadProviders = useCallback(
    async () => {
      setLoading(true);
      try {
        await getProviders();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar os fornecedores');
      } finally {
        setLoading(false);
      }
    },
    [getProviders],
  );

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Fornecedores
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container} container`}>
        <main>
          <div className={styles.title}>
            <p>Fornecedores</p>
            <Link href="/adicionar-fornecedores" title="Adicionar fornecedor">
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
                <th>Produtos</th>
              </tr>
            </thead>

            <tbody>
              {providers?.map((provider) => (
                <tr key={provider?.fo_id}>
                  <td>
                    <Link href={`/fornecedor/${provider?.fo_id}`}>
                      <p>
                        {provider?.fo_id}
                      </p>
                    </Link>
                  </td>
                  <td>
                    {provider?.fo_nome}
                  </td>
                  <td>
                    {provider?.fo_list_produto?.length}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </main>
      </div>
    </>
  );
};

export default withAuth(Providers);
