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
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import styles from '../../../styles/Deposit.module.scss';
import { useQuarkusContext, MovementsProps } from '../../context/useQuarkus';
import withAuth from '../../logic/auth';

const Deposit: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    movements, getMovements,
  } = useQuarkusContext();

  const [movement, setMovement] = useState<MovementsProps>();

  const [loading, setLoading] = useState(false);

  const date = useMemo(() => {
    if (movement?.mo_data) {
      const movementDate = movement?.mo_data.replace('[UTC]', '');
      return format(new Date(movementDate), 'dd/MM/yyyy');
    }

    return null;
  }, [movement?.mo_data]);

  const price = useMemo(() => {
    if (movement?.mo_preco_produto) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(movement?.mo_preco_produto);
    }

    return 'R$ 0';
  }, [movement?.mo_preco_produto]);

  const loadMovements = useCallback(
    async () => {
      setLoading(true);
      try {
        await getMovements();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar depósito');
      } finally {
        setLoading(false);
      }
    },
    [getMovements],
  );

  useEffect(() => {
    loadMovements();
  }, [loadMovements]);

  useEffect(() => {
    setMovement(movements.find((item) => item?.mo_id === Number(id)));
  }, [id, movements]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Movimentação
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
                    {movement?.mo_id}
                  </h1>
                  <div className={styles.info}>
                    <p>
                      Data de criação:
                    </p>
                    <span>
                      {' '}
                      {date}
                    </span>
                  </div>

                  <h2 className="card-title">
                    Informações
                  </h2>

                  <Collapsible
                    accordion
                    popout
                  >
                    <CollapsibleItem
                      expanded={false}
                      header={movement?.mo_tipo}
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
                              {movement?.mo_id}
                            </span>
                          </div>
                          <div className={styles?.info}>
                            <p>
                              Data de criação:
                            </p>
                            <span>
                              {' '}
                              {date}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Desposito de destino:
                            </p>
                            <span>
                              {' '}
                              {movement?.mo_id_deposito_destino_fk}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Desposito de origem
                            </p>
                            <span>
                              {' '}
                              {movement?.mo_id_deposito_origem_fk}
                            </span>
                          </div>
                          <div className={styles.info}>
                            <p>
                              Fornecedor id:
                            </p>
                            <span>
                              {' '}
                              {movement?.mo_id_fornecedor_fk}
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
                              {movement?.mo_quantidade}
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

export default withAuth(Deposit);
