import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const AddProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { data } = await axios.post('http://localhost:8080/produto/cria', req.body, {
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

export default AddProduct;
