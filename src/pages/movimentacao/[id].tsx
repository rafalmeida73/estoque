import { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Head from 'next/head';
import {
  Collapsible, CollapsibleItem, Icon,
} from 'react-materialize';
import format from 'date-fns/format';
import Loading from '../../components/Loading';
import { api } from '../../services/api';
import styles from '../../../styles/Deposit.module.scss';
import { MovementsProps } from '../api/getlength';

const Deposit: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const [movement, setMovement] = useState<MovementsProps>();
  const [loading, setLoading] = useState(false);

  const date = useMemo(() => {
    if (movement?.data_movimentacao) {
      const movementDate = movement?.data_movimentacao.replace('[UTC]', '');
      return format(new Date(movementDate), 'dd/MM/yyyy');
    }

    return null;
  }, [movement?.data_movimentacao]);

  const price = useMemo(() => {
    if (movement?.produto?.preco) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(movement?.produto?.preco);
    }

    return 'R$ 0';
  }, [movement?.produto?.preco]);

  const getMovement = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<MovementsProps>(`/movement/${id}`);
      setMovement(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getMovement();
  }, [getMovement]);

  if (loading || !movement) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Depósito
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
                  <h1 className="card-title">
                    Movimentação:
                    {' '}
                    {movement?.id_movimentacao}
                  </h1>
                  <div className={styles.info}>
                    <p>
                      Data:
                    </p>
                    <span>
                      {' '}
                      {date}
                    </span>
                  </div>

                  <h2 className="card-title">
                    Produto
                  </h2>

                  <Collapsible
                    accordion
                    popout
                  >
                    <CollapsibleItem
                      expanded={false}
                      header={movement?.produto?.nome_produto}
                      icon={<Icon>storage</Icon>}
                      node="div"
                    >
                      <div className={styles.cardContainer}>
                        <div>
                          <div className={styles.info}>
                            <p>
                              Identificador:
                            </p>
                            <span>
                              {' '}
                              {movement?.produto?.id_produto}
                            </span>
                          </div>
                          <div className={styles?.info}>
                            <p>
                              Nome:
                            </p>
                            <span>
                              {' '}
                              {movement?.produto?.nome_produto}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Ponto de reposição:
                            </p>
                            <span>
                              {' '}
                              {movement?.produto?.pontoReposicao_produto}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Preço:
                            </p>
                            <span>
                              {' '}
                              {price}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Quantidade:
                            </p>
                            <span>
                              {' '}
                              {movement?.produto?.quantidade_produto}
                            </span>
                          </div>
                        </div>
                      </div>

                    </CollapsibleItem>
                  </Collapsible>

                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Deposit;
