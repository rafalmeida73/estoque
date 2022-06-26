import Head from 'next/head';
import { useEffect } from 'react';

import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';
import styles from '../../styles/Menu.module.scss';
import NumberCard from '../components/NumberCard';
import { useQuarkusContext } from '../context/useQuarkus';
import withAuth from '../logic/auth';

const Menu = () => {
  const {
    deposits, movements, products, providers, getDeposits, getMovements, getProducts, getProviders,
  } = useQuarkusContext();

  useEffect(() => {
    getDeposits();
    getMovements();
    getProducts();
    getProviders();
  }, [getDeposits, getMovements, getProducts, getProviders]);

  return (
    <>
      <Head>
        <title>
          Menu
          {' '}
          | Estoque
        </title>
      </Head>
      <div className={`${styles.container}`}>
        <main>
          <div className={`${styles.containerCards} row`}>
            <div className="col s6 m3 l3 ">
              <NumberCard icon="business" number={deposits?.length || 0} title="Depósitos" link="/depositos" />
            </div>
            <div className="col s6 m3 l3">
              <NumberCard icon="cached" number={movements?.length || 0} title="Movimentações" link="/movimentacoes" />
            </div>
            <div className="col s6 m3 l3">
              <NumberCard icon="storage" number={products?.length || 0} title="Produtos" link="/produtos" />
            </div>
            <div className="col s6 m3 l3">
              <NumberCard icon="business_center" number={providers?.length || 0} title="Fornecedores" link="/fornecedores" />
            </div>
          </div>

          <div className={styles.chart}>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={10}
              width={650}
            >
              <VictoryBar
                style={{ data: { fill: '#E26565' } }}
                alignment="start"
                data={[
                  { title: 'Depósitos', quantity: deposits?.length || 0 },
                  { title: 'Movimentações', quantity: movements?.length || 0 },
                  { title: 'Produtos', quantity: products?.length || 0 },
                  { title: 'Fornecedores', quantity: providers?.length || 0 },
                ]}
                x="title"
                y="quantity"
                animate={{
                  duration: 3000,
                  onLoad: { duration: 3000 },
                }}
              />
            </VictoryChart>
          </div>
        </main>
      </div>
    </>
  );
};

export default withAuth(Menu);
