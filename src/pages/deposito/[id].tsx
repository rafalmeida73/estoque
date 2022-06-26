import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Collapsible, CollapsibleItem, Icon,
} from 'react-materialize';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Loading from '../../components/Loading';
import styles from '../../../styles/Deposit.module.scss';
import { DepositsProps, useQuarkusContext } from '../../context/useQuarkus';
import { api } from '../../services/api';
import withAuth from '../../logic/auth';

const Deposit: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    deposits, getDeposits,
  } = useQuarkusContext();

  const [deposit, setDeposit] = useState<DepositsProps>();
  const [loading, setLoading] = useState(false);

  const price = useCallback((value: number) => {
    if (value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }

    return 'R$ 0';
  }, []);

  const handleRemoveProductFromDeposit = useCallback(async (idProduct: number) => {
    const addToast = toast.loading('Carregando...');

    try {
      setLoading(true);
      await api.delete<DepositsProps>(`/removeProductFromDeposit/${id}/${idProduct}`);

      toast.update(addToast, {
        render: 'Produto removido do depósito com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getDeposits();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover o produto do depósito, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getDeposits, id]);

  const loadDeposits = useCallback(
    async () => {
      setLoading(true);
      try {
        await getDeposits();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar depósito');
      } finally {
        setLoading(false);
      }
    },
    [getDeposits],
  );

  const handleDeleteDeposit = useCallback(async () => {
    const addToast = toast.loading('Carregando...');

    try {
      setLoading(true);
      await api.delete(`deleteDeposit/${id}`);

      toast.update(addToast, {
        render: 'Depósito removido  com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getDeposits();

      router.push('/depositos');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover  depósito, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getDeposits, id, router]);

  useEffect(() => {
    loadDeposits();
  }, [getDeposits, loadDeposits]);

  useEffect(() => {
    setDeposit(deposits.find((item) => item?.de_id === Number(id)));
  }, [deposits, id]);

  if (loading) {
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

                  <section>
                    <h1 className="card-title">
                      Depósito:
                      {' '}
                      {deposit?.de_nome}
                    </h1>

                    <div>
                      <button type="button" onClick={handleDeleteDeposit} title="Deletar">
                        <Icon>delete</Icon>
                      </button>
                      <Link href={`/editar-deposito/${id}`} title="Editar">
                        <Icon>edit</Icon>
                      </Link>
                    </div>
                  </section>

                  <p>
                    Identificador:
                    {id}
                  </p>

                  {deposit?.de_id_fk && (
                    <>
                      <section>
                        <h2 className="card-title">
                          Produtos
                        </h2>
                        <Link href="/adicionar-produto-deposito">
                          <Icon>add</Icon>
                        </Link>
                      </section>

                      {deposit?.de_id_fk?.map((item) => (
                        <Collapsible
                          accordion
                          popout
                          key={item?.pr_id}
                        >
                          <CollapsibleItem
                            expanded={false}
                            header={item.pr_nome}
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
                                    {item?.pr_id}
                                  </span>
                                </div>

                                <div className={styles.info}>
                                  <p>
                                    Ponto de reposição:
                                  </p>
                                  <span>
                                    {' '}
                                    {item?.pr_reposicao}
                                  </span>
                                </div>
                                <div className={styles.info}>
                                  <p>
                                    Preço:
                                  </p>
                                  <span>
                                    {' '}
                                    {price(item?.pr_preco)}
                                  </span>
                                </div>
                                <div className={styles.info}>
                                  <p>
                                    Quantidade:
                                  </p>
                                  <span>
                                    {' '}
                                    {item?.pr_quantidade}
                                  </span>
                                </div>
                              </div>
                              <button type="button" onClick={() => handleRemoveProductFromDeposit(item?.pr_id)}>
                                <Icon>delete</Icon>
                              </button>
                            </div>
                          </CollapsibleItem>
                        </Collapsible>
                      ))}
                    </>
                  )}
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
