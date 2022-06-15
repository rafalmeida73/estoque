import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    id_deposito: yup.string().required('Campo obrigatório'),
    id_produto: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
