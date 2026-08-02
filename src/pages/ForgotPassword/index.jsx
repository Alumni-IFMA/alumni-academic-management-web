import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { forgotPassword } from "../../services/authService";

const schema = yup.object({
  email: yup.string().trim().email("Email inválido").required("Email é obrigatório"),
});

export function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit({ email }) {
    try {
      await forgotPassword({ email });
      navigate("/auth/reset-password/code", { state: { email } });
    } catch (error) {
      console.error("Erro ao solicitar recuperação de senha:", error);
      toast.error(
        error.response?.data?.message ??
          "Não foi possível enviar o código. Verifique o e-mail informado."
      );
    }
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col w-full max-w-[380px] mx-auto items-center px-4">
        <Typography variant="h1" className="!text-3xl sm:!text-4xl text-center mb-4">
          Esqueci minha senha
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[380px] mx-auto px-4">
        <FormField>
          <Label htmlFor="email">Email</Label>
          <InputField
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu email cadastrado"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </FormField>

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold mt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-biege font-semibold px-6 py-3 w-full rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          <button type="button" onClick={() => navigate("/auth/login")} className="text-green">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
