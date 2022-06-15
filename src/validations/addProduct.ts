import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    nome_produto: yup.string().required('Campo obrigatório'),
    preco: yup.string().required('Campo obrigatório'),
    quantidade_produto: yup.string().required('Campo obrigatório'),
    pontoReposicao_produto: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
