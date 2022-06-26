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
import { ProvidersProps, useQuarkusContext } from '../../context/useQuarkus';
import { api } from '../../services/api';
import withAuth from '../../logic/auth';

const Provider: NextPage = () => {
  const router = useRouter();
  const id = `${router?.query?.id}`;

  const {
    providers, getProviders,
  } = useQuarkusContext();

  const [provider, setProvider] = useState<ProvidersProps>();
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
      await api.delete(`/removeProductFromProvider/${id}/${idProduct}`);

      toast.update(addToast, {
        render: 'Produto removido do fornecedor com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getProviders();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover o produto do fornecedor, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getProviders, id]);

  const loadProviders = useCallback(
    async () => {
      setLoading(true);
      try {
        await getProviders();
      } catch (error) {
        toast.error('Ocorreu um erro ao requisitar Fornecedor');
      } finally {
        setLoading(false);
      }
    },
    [getProviders],
  );

  const handleDeleteProvider = useCallback(async () => {
    const addToast = toast.loading('Carregando...');

    try {
      setLoading(true);
      await api.delete(`deleteProvider/${id}`);

      toast.update(addToast, {
        render: 'Fornecedor removido  com sucesso', type: 'success', isLoading: false, autoClose: 5000,
      });

      await getProviders();

      router.push('/fornecedores');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.update(addToast, {
        render: 'Ocorreu um eror ao tentar remover fornecedor, tente novamnete', type: 'error', isLoading: false, autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [getProviders, id, router]);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    setProvider(providers.find((item) => item?.fo_id === Number(id)));
  }, [id, providers]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>
          Fornecedor
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
                      Fornecedor:
                      {' '}
                      {provider?.fo_nome}
                    </h1>

                    <div>
                      <button type="button" onClick={handleDeleteProvider} title="Deletar">
                        <Icon>delete</Icon>
                      </button>
                      <Link href={`/editar-fornecedor/${id}`} title="Editar">
                        <Icon>edit</Icon>
                      </Link>
                    </div>
                  </section>

                  {provider?.fo_list_produto && (
                    <>
                      <section>
                        <h2 className="card-title">
                          Produtos
                        </h2>
                        <Link href="/adicionar-produto-fornecedor">
                          <Icon>add</Icon>
                        </Link>
                      </section>

                      {provider?.fo_list_produto?.map((item) => (
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

export default withAuth(Provider);
