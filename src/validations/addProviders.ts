import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    nome_fornecedor: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
