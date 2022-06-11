import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { DepositsProps } from './getlength';

const getlength = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { data: deposits } = await axios.get<DepositsProps[]>('http://localhost:8080/deposito/lista', {
        headers: {
          accept: 'application/json',
        },
      });

      return res.status(200).json(deposits);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  res.setHeader('Allow', 'GET');
  return res.status(405).end('Method not allowed');
};

export default getlength;
