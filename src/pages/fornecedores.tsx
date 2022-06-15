import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Providers.module.scss';
import Loading from '../components/Loading';
import { api } from '../services/api';
import { ProvidersProps } from './api/getlength';

const Providers = () => {
  const [providers, setProviders] = useState<ProvidersProps[]>();

  const getProviders = useCallback(async () => {
    try {
      const { data } = await api.get<ProvidersProps[]>('/providers');
      setProviders(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar o fornecedores');
    }
  }, []);

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  if (!providers) {
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
              </tr>
            </thead>

            <tbody>
              {providers?.map((provider) => (
                <tr key={provider?.id_fornecedor}>
                  <td>
                    {provider?.id_fornecedor}
                  </td>
                  <td>
                    {provider?.nome_fornecedor}
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

export default Providers;
