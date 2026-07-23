import * as yup from "yup";

export const registerFormSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),

  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .transform((value) => value?.replace(/\D/g, "")) // Remove caracteres não numéricos
    .matches(/^\d{11}$/, "CPF deve conter 11 dígitos"),

  email: yup
    .string()
    .trim()
    .email("Email inválido")
    .required("Email é obrigatório"),

  campus: yup.string().required("Campus é obrigatório"),

  modality: yup.string().required("Modalidade é obrigatória"),

  lastCourse: yup
    .number()
    .typeError("Selecione o curso")
    .required("Selecione o curso"),

  graduationYear: yup
    .number()
    .typeError("Selecione o ano de finalização")
    .required("Selecione o ano de finalização"),

  yearEntry: yup
    .number()
    .typeError("Selecione o ano de ingresso")
    .required("Selecione o ano de ingresso")
    .test(
      "entry-before-graduation",
      "Ano de ingresso deve ser anterior ou igual ao ano de finalização",
      function (value) {
        const graduationYear = this.parent.graduationYear;
        if (!value || !graduationYear) return true; // Se algum dos anos não estiver definido, não faz a validação
        return value <= graduationYear;
      },
    ),
});
