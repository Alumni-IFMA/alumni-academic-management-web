import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { verifyResetCode } from "../../services/authService";

const schema = yup.object({
  code: yup.string().trim().required("Código é obrigatório"),
});

export function VerifyResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!email) {
      toast.error("Solicite um novo código antes de continuar.");
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  async function onSubmit({ code }) {
    try {
      await verifyResetCode({ email, code });
      navigate("/auth/reset-password", { state: { email, code } });
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      toast.error(
        error.response?.data?.message ?? "Código inválido ou expirado. Tente novamente."
      );
    }
  }

  if (!email) {
    return null;
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col w-full max-w-[380px] mx-auto items-center px-4">
        <Typography variant="h1" className="!text-3xl sm:!text-4xl text-center mb-4">
          Código de recuperação
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[380px] mx-auto px-4">
        <FormField>
          <Label htmlFor="code">Código</Label>
          <InputField
            type="text"
            id="code"
            name="code"
            placeholder="Digite o código recebido por e-mail"
            autoComplete="one-time-code"
            {...register("code")}
          />
          {errors.code && (
            <span className="text-red-500 text-sm">{errors.code.message}</span>
          )}
        </FormField>

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold mt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-biege font-semibold px-6 py-3 w-full rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verificando..." : "Verificar"}
          </button>
          <button type="button" onClick={() => navigate("/auth/forgot-password")} className="text-green">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
