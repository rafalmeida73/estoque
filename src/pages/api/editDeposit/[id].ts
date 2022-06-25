import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const editDeposit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const bodyData = {
      de_nome: req.body.de_nome,
      de_id_fk: [],
    };

    try {
      const { data } = await axios.put(`http://localhost:8080/deposito/${id}`, bodyData, {
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

export default editDeposit;
