import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/Movimentacoes.module.scss';
import Loading from '../components/Loading';
import { api } from '../services/api';
import { MovementsProps } from './api/getlength';

const Movimentacoes = () => {
  const [movements, setMovements] = useState<MovementsProps[]>();

  const getDeposits = useCallback(async () => {
    try {
      const { data } = await api.get<MovementsProps[]>('/movements');
      setMovements(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar o tamanhos');
    }
  }, []);

  useEffect(() => {
    getDeposits();
  }, [getDeposits]);

  if (!movements) {
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
            {/* <Link href="/adicionar-movimentacao" title="Adicionar movimentação">
              <Icon small>
                add
              </Icon>
            </Link> */}
          </div>

          <table className="striped highlight centered ">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Nome do produto</th>
                <th>Quantidade</th>
                <th>Tipo</th>
              </tr>
            </thead>

            <tbody>
              {movements?.map((movement) => (
                <tr key={movement?.id_movimentacao}>
                  <td>
                    <Link href={`/movimentacao/${movement?.id_movimentacao}`}>
                      <p>
                        {movement?.id_movimentacao}
                      </p>
                    </Link>
                  </td>
                  <td>{movement?.produto?.nome_produto}</td>
                  <td>{movement?.quantidade_movimentacao}</td>
                  <td>{movement?.tipo_movimentacao}</td>
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
