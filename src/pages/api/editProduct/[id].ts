import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const editProdut = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === 'PUT') {
    try {
      const { data } = await axios.put(`http://localhost:8080/produto/altera/${id}`, req.body, {
        headers: {
          accept: 'application/json',
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  res.setHeader('Allow', 'PUT');
  return res.status(405).end('Method not allowed');
};

export default editProdut;
