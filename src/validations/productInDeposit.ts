import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    id_deposito: yup.object().required('Campo obrigatório'),
    id_produto: yup.object().required('Campo obrigatório'),
    tipo: yup.object(),
  }).required();

  return validation;
};
