import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export interface MovementsProps{
    'id_movimentacao': number,
    'data_movimentacao': string,
    'tipo_movimentacao': string,
    'quantidade_movimentacao': number,
    'produto': {
      'id_produto': number,
      'nome_produto': string,
      'preco': number,
      'quantidade_produto': number,
      'pontoReposicao_produto': number
    }
}

export interface ProductsProps{
  'id_produto': number,
  'nome_produto': string,
  'pontoReposicao_produto': number,
  'preco': number,
  'quantidade_produto': number
}

export interface DepositsProps{
    'id_deposito': number,
    'nome_deposito':string,
    'pontoReposicao_deposito': number,
    'produto': Array<ProductsProps>
}

export interface ProvidersProps{
  'id_fornecedor': number,
  'nome_fornecedor': string
}

export interface GetlengthResponse{
    'deposits': number,
    'movements': number,
    'providers': number,
    'products': number
}

const getlength = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { data: deposits } = await axios.get<MovementsProps[]>('http://localhost:8080/deposito/lista', {
      headers: {
        accept: 'application/json',
      },
    });
    const { data: movements } = await axios.get<DepositsProps[]>('http://localhost:8080/movimentacao/lista', {
      headers: {
        accept: 'application/json',
      },
    });
    const { data: providers } = await axios.get<ProvidersProps[]>('http://localhost:8080/fornecedor/lista', {
      headers: {
        accept: 'application/json',
      },
    });
    const { data: products } = await axios.get<ProductsProps[]>('http://localhost:8080/produto/lista', {
      headers: {
        accept: 'application/json',
      },
    });

    const response = {
      deposits: deposits.length,
      movements: movements.length,
      providers: providers.length,
      products: products.length,
    };

    return res.status(200).json(response);
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).end('Method not allowed');
};

export default getlength;
