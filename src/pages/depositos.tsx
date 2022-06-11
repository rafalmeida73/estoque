import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Deposits.module.scss';
import Loading from '../components/Loading';
import { api } from '../services/api';
import { DepositsProps } from './api/getlength';

const Deposits = () => {
  const [deposits, setDeposits] = useState<DepositsProps[]>();

  const getDeposits = useCallback(async () => {
    try {
      const { data } = await api.get<DepositsProps[]>('/depositsList');
      setDeposits(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar o tamanhos');
    }
  }, []);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  if (!deposits) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Depósitos
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container} container`}>
        <main>
          <div className={styles.title}>
            <p>Depósitos</p>
            <Link href="/adicionar-deposito" title="Adicionar depósito">
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
                <th>Ponto de reposição</th>
                <th>Produtos</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((deposit) => (
                <tr key={deposit?.id_deposito}>
                  <td>
                    <Link href={`/deposito/${deposit?.id_deposito}`}>
                      <p>
                        {deposit?.id_deposito}
                      </p>
                    </Link>
                  </td>
                  <td>{deposit?.nome_deposito}</td>
                  <td>{deposit?.pontoReposicao_deposito}</td>
                  <td>{deposit?.produto?.length}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </main>
      </div>
    </>
  );
};

export default Deposits;
