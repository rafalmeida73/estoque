import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    pr_nome: yup.string().required('Campo obrigatório'),
    pr_preco: yup.string().required('Campo obrigatório'),
    pr_quantidade: yup.string().required('Campo obrigatório'),
    pr_categoria: yup.string().required('Campo obrigatório'),
    pr_reposicao: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
