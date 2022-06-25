import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    nome_deposito: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
