import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const AddProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const bodyData = {
      fo_nome: req.body.fo_nome,
      fo_list_produto: [],
    };
    try {
      const { data } = await axios.post('http://localhost:8080/fornecedor', bodyData, {
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

export default AddProvider;
