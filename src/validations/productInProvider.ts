import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    id_fornecedor: yup.object().required('Campo obrigatório'),
    id_produto: yup.object().required('Campo obrigatório'),
  }).required();

  return validation;
};
