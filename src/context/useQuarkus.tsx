import React, {
  createContext, ReactNode, useCallback, useContext, useMemo, useState,
} from 'react';

import { api } from '../services/api';

export interface MovementsProps {
  mo_data: string,
  mo_id: number,
  mo_id_deposito_destino_fk: number,
  mo_id_deposito_origem_fk: number,
  mo_id_fornecedor_fk: number,
  mo_id_produto_fk: number,
  mo_preco_produto: number,
  mo_quantidade: number,
  mo_tipo: string
}

export interface ProductsProps {
  pr_id: number,
  pr_nome: string,
  pr_pont_repo: boolean,
  pr_preco: number,
  pr_quantidade: number,
  pr_reposicao: number,
  pr_categoria: string,
}

export interface DepositsProps {
  de_id: number,
  de_id_fk: Array<ProductsProps>,
  de_nome: string
}

export interface ProvidersProps {
  fo_id: number,
  fo_nome: string
  fo_list_produto: Array<ProductsProps>
}

export interface UsersProps {
  email: string,
  senha: string
}

export interface GetlengthResponse {
  deposits: number,
  movements: number,
  providers: number,
  products: number
}

interface QuarkusContextData{
  getDeposits: () => Promise<void>;
  deposits: DepositsProps[];
  getMovements: () => Promise<void>;
  movements: MovementsProps[];
  getProviders: () => Promise<void>;
  providers: ProvidersProps[];
  getProducts: () => Promise<void>;
  products: ProductsProps[];
  getUsers: () => Promise<void>;
  users: UsersProps[]
}

const QuarkusContext = createContext({} as QuarkusContextData);

const QuarkusContextProvider = ({ children } : {children: ReactNode}) => {
  const [deposits, setDeposits] = useState<DepositsProps[]>([]);
  const [movements, setMovements] = useState<MovementsProps[]>([]);
  const [providers, setProviders] = useState<ProvidersProps[]>([]);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [users, setUsers] = useState<UsersProps[]>([]);

  const getDeposits = useCallback(async () => {
    try {
      const { data } = await api.get<DepositsProps[]>('/depositsList');
      setDeposits(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const getMovements = useCallback(async () => {
    try {
      const { data } = await api.get<MovementsProps[]>('/movements');
      setMovements(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const getProviders = useCallback(async () => {
    try {
      const { data } = await api.get<ProvidersProps[]>('/providers');
      setProviders(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const { data } = await api.get<UsersProps[]>('/login');
      setUsers(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const { data } = await api.get<ProductsProps[]>('/products');
      setProducts(data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, []);

  const value = useMemo(() => ({
    getDeposits,
    deposits,
    getMovements,
    movements,
    getProviders,
    providers,
    getProducts,
    products,
    getUsers,
    users,
  }), [deposits, getDeposits, getMovements, getProducts, getProviders, getUsers, movements, products, providers, users]);

  return (
    <QuarkusContext.Provider value={value}>
      {children}
    </QuarkusContext.Provider>
  );
};

const useQuarkusContext = ():QuarkusContextData => {
  const context = useContext(QuarkusContext);
  if (context === undefined) {
    throw new Error('No context on QuarkusContext');
  }
  return context;
};

export { useQuarkusContext };
export default QuarkusContextProvider;
