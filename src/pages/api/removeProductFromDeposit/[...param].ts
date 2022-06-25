import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const removeProductFromDeposit = async (req: NextApiRequest, res: NextApiResponse) => {
  const { param } = req.query;
  if (req.method === 'DELETE') {
    try {
      const { data } = await axios.delete(`http://localhost:8080/service/deposito/${param[0]}/produto/${param[1]}/doacao`, {
        headers: {
          accept: 'application/json',
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      const { data } = await axios.delete(`http://localhost:8080/service/deposito/${param[0]}/produto/${param[1]}/NF`, {
        headers: {
          accept: 'application/json',
        },
      });

      return res.status(200).json(data);
    }
  }

  res.setHeader('Allow', 'DELETE');
  return res.status(405).end('Method not allowed');
};

export default removeProductFromDeposit;
