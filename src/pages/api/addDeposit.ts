import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const addDeposit = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const reqData = {
        de_nome: req.body.nome_deposito,
        de_id_fk: [],
      };

      const { data } = await axios.post('http://localhost:8080/deposito', reqData, {
        headers: {
          accept: 'application/json',
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  res.setHeader('Allow', 'POST');
  return res.status(405).end('Method not allowed');
};

export default addDeposit;
