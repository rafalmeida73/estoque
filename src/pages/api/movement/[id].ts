import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { MovementsProps } from '../getlength';

const movement = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const { data } = await axios.get<MovementsProps>(`http://localhost:8080/movimentacao/buscaPorId/${id}`, {
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

export default movement;
