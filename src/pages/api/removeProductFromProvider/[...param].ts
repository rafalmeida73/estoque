import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const removeProductFromProvider = async (req: NextApiRequest, res: NextApiResponse) => {
  const { param } = req.query;
  if (req.method === 'DELETE') {
    try {
      const { data } = await axios.delete(`http://localhost:8080/service/fornecedor/${param[0]}/produto/${param[1]}`, {
        headers: {
          accept: 'application/json',
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).send('Internal server error');
    }
  }

  res.setHeader('Allow', 'DELETE');
  return res.status(405).end('Method not allowed');
};

export default removeProductFromProvider;
