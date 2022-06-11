import * as yup from 'yup';

export const schema = () => {
  const validation = yup.object({
    email: yup.string().required('Campo obrigatório').email('Informe um e-mail valido'),
    password: yup.string().required('Campo obrigatório').min(5, 'Insira no mínimo 5 caracteres'),
  }).required();

  return validation;
};
