import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { ProductsProps } from '../../context/useQuarkus';

const products = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get<ProductsProps[]>('http://localhost:8080/produto', {
        headers: {
          accept: 'application/json',
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).end('Method not allowed');
};

export default products;
