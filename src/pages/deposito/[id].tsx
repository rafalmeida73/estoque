import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Collapsible, CollapsibleItem, Icon,
} from 'react-materialize';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { api } from '../../services/api';
import styles from '../../../styles/Deposit.module.scss';
import { DepositsProps } from '../api/getlength';

const Deposit: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const [deposit, setDeposit] = useState<DepositsProps>();
  const [loading, setLoading] = useState(false);

  const getDeposit = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<DepositsProps>(`/getDeposit/${id}`);
      setDeposit(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const price = useCallback((value: number) => {
    if (value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    }

    return 'R$ 0';
  }, []);

  const handleRemoveProductFromDeposit = useCallback(async (idProduct: number, idDeposit: number) => {
    const addToast = toast.loading('Carregando...');

    try {
      setLoading(true);
      await api.get<DepositsProps>(`/removeProductFromDeposit/${idProduct}/${idDeposit}`);

      toast.update(addToast, {
        render: 'Produto removido do depósito com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getDeposit();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover o produto do depósito, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getDeposit]);

  useEffect(() => {
    getDeposit();
  }, [getDeposit]);

  if (loading || !deposit) {
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
                    Depósito:
                    {' '}
                    {id}
                  </h1>
                  <div className={styles.info}>
                    <p>
                      Nome:
                    </p>
                    <span>
                      {' '}
                      {deposit?.nome_deposito}
                    </span>
                  </div>
                  <div className={styles.info}>
                    <p>
                      Ponto de reposição:
                    </p>
                    <span>
                      {' '}
                      {deposit?.pontoReposicao_deposito}
                    </span>
                  </div>
                  {deposit?.produto && (
                    <>
                      <h2 className="card-title">
                        Produtos
                      </h2>

                      {deposit?.produto?.map((item) => (
                        <Collapsible
                          accordion
                          popout
                        >
                          <CollapsibleItem
                            expanded={false}
                            header={item.nome_produto}
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
                                    {item?.id_produto}
                                  </span>
                                </div>
                                <div className={styles?.info}>
                                  <p>
                                    Nome:
                                  </p>
                                  <span>
                                    {' '}
                                    {item?.nome_produto}
                                  </span>
                                </div>
                                <div className={styles.info}>
                                  <p>
                                    Ponto de reposição:
                                  </p>
                                  <span>
                                    {' '}
                                    {item?.pontoReposicao_produto}
                                  </span>
                                </div>
                                <div className={styles.info}>
                                  <p>
                                    Preço:
                                  </p>
                                  <span>
                                    {' '}
                                    {price(item?.preco)}
                                  </span>
                                </div>
                                <div className={styles.info}>
                                  <p>
                                    Quantidade:
                                  </p>
                                  <span>
                                    {' '}
                                    {item?.quantidade_produto}
                                  </span>
                                </div>
                              </div>
                              <button type="button" onClick={() => handleRemoveProductFromDeposit(item?.id_produto, Number(id))}>
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

export default Deposit;
