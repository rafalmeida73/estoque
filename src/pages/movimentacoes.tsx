import { format } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/Movimentacoes.module.scss';
import Loading from '../components/Loading';
import { useQuarkusContext } from '../context/useQuarkus';

const Movimentacoes = () => {
  const {
    getMovements, movements,
  } = useQuarkusContext();

  const [loading, setLoading] = useState(false);

  const loadMovemnts = useCallback(async () => {
    setLoading(true);
    try {
      await getMovements();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar movimentações');
    } finally {
      setLoading(false);
    }
  }, [getMovements]);

  const formartDate = useCallback((date: string) => {
    if (date) {
      const movementDate = date.replace('[UTC]', '');
      return format(new Date(movementDate), 'dd/MM/yyyy');
    }

    return null;
  }, []);

  useEffect(() => {
    loadMovemnts();
  }, [loadMovemnts]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>
          Movimentações
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container} container`}>
        <main>
          <div className={styles.title}>
            <p>Movimentações</p>
          </div>

          <table className="striped highlight centered ">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Data de criação</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {movements?.map((movement) => (
                <tr key={movement?.mo_id}>
                  <td>
                    <Link href={`/movimentacao/${movement?.mo_id}`}>
                      <p>
                        {movement?.mo_id}
                      </p>
                    </Link>
                  </td>
                  <td>{formartDate(movement.mo_data)}</td>
                  <td>{movement?.mo_tipo}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
};

export default Movimentacoes;
