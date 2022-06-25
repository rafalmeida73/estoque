import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    de_nome: yup.string().required('Campo obrigatório'),
  }).required();

  return validation;
};
