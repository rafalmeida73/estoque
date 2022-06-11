import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const getDeposit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { param } = req.query;
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get(`http://localhost:8080/deposito/remProdDeposito/${param[0]}/${param[1]}`, {
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

export default getDeposit;
