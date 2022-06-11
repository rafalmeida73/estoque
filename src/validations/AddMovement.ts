import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    tipo_movimentacao: yup.string().required('Campo obrigatório'),
    quantidade_movimentacao: yup.string().required('Campo obrigatório'),
    produto: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
