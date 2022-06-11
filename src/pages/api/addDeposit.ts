import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const addDeposit = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const reqData = {
        id_deposito: 0,
        nome_deposito: req.body.nome_deposito,
        pontoReposicao_deposito: req.body.pontoReposicao_deposito,
        produto: [],
      };

      const { data } = await axios.post('http://localhost:8080/deposito/cria', reqData, {
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
