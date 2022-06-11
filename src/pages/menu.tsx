import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory';
import styles from '../../styles/Menu.module.scss';
import Loading from '../components/Loading';
import NumberCard from '../components/NumberCard';
import { api } from '../services/api';
import { GetlengthResponse } from './api/getlength';

const Menu = () => {
  const [length, setLength] = useState<GetlengthResponse>();

  const getDeposits = async () => {
    try {
      const { data } = await api.get<GetlengthResponse>('getlength');
      setLength(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      toast.error('Ocorreu um erro ao requisitar o tamanhos');
    }
  };

  useEffect(() => {
    getDeposits();
  }, []);

  if (!length) {
    return <Loading />;
  }

  return (
    <div className={`${styles.container}`}>
      <main>
        <div className={`${styles.containerCards} row`}>
          <div className="col s6 m3 l3 ">
            <NumberCard icon="business" number={length?.deposits || 0} title="Depósitos" />
          </div>
          <div className="col s6 m3 l3">
            <NumberCard icon="cached" number={length?.movements || 0} title="Movimentações" />
          </div>
          <div className="col s6 m3 l3">
            <NumberCard icon="storage" number={length?.products || 0} title="Produtos" />
          </div>
          <div className="col s6 m3 l3">
            <NumberCard icon="business_center" number={length?.providers || 0} title="Fornecedores" />
          </div>
        </div>

        <div className={styles.chart}>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
            width={650}
          >
            <VictoryBar
              style={{ data: { fill: '#00A7E7' } }}
              alignment="start"
              data={[
                { title: 'Depósitos', quantity: length?.deposits || 0 },
                { title: 'Movimentações', quantity: length?.movements || 0 },
                { title: 'Produtos', quantity: length?.products || 0 },
                { title: 'Fornecedores', quantity: length?.providers || 0 },
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
  );
};

export default Menu;
