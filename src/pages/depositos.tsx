import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { Icon } from 'react-materialize';
import { toast } from 'react-toastify';
import styles from '../../styles/Deposits.module.scss';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';

const Deposits = () => {
  const {
    deposits, getDeposits,
  } = useQuarkusContext();

  const loadDeposits = useCallback(
    async () => {
      try {
        await getDeposits();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar os depósitos');
      }
    },
    [getDeposits],
  );

  useEffect(() => {
    loadDeposits();
  }, [getDeposits, loadDeposits]);

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
                <th>Produtos</th>
              </tr>
            </thead>

            <tbody>
              {deposits?.map((deposit) => (
                <tr key={deposit?.de_id}>
                  <td>
                    <Link href={`/deposito/${deposit?.de_id}`}>
                      <p>
                        {deposit?.de_id}
                      </p>
                    </Link>
                  </td>
                  <td>{deposit?.de_nome}</td>
                  <td>{deposit?.de_id_fk?.length}</td>
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
