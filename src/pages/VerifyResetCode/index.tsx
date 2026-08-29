import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { forgotPassword, verifyResetCode } from "../../services/authService";

const schema = yup.object({
  code: yup.string().trim().required("Código é obrigatório"),
});

interface VerifyResetCodeFormValues {
  code: string;
}

interface VerifyResetCodeLocationState {
  email?: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain || local.length <= 2) {
    return email;
  }
  const first = local[0];
  const last = local[local.length - 1];
  const masked = "*".repeat(local.length - 2);
  return `${first}${masked}${last}@${domain}`;
}

export function VerifyResetCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as VerifyResetCodeLocationState | null;
  const email = state?.email;
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetCodeFormValues>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (!email) {
      toast.error("Solicite um novo código antes de continuar.");
      navigate("/auth/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  async function onSubmit({ code }: VerifyResetCodeFormValues) {
    try {
      await verifyResetCode({ email: email!, code });
      navigate("/auth/reset-password", { state: { email, code } });
    } catch (error) {
      console.error("Erro ao verificar código:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Código inválido ou expirado. Tente novamente.");
    }
  }

  async function handleResend() {
    setIsResending(true);
    try {
      await forgotPassword({ email: email! });
      toast.success("Código reenviado!");
    } catch (error) {
      console.error("Erro ao reenviar código:", error);
      toast.error("Não foi possível reenviar o código. Tente novamente.");
    } finally {
      setIsResending(false);
    }
  }

  if (!email) {
    return null;
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col w-full max-w-[380px] mx-auto items-center px-4">
        <Typography variant="h1" className="!text-3xl sm:!text-4xl text-center whitespace-nowrap mb-4">
          Código de recuperação
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[380px] mx-auto px-4">
        <p className="text-sm text-dark-green text-center mb-4">
          Verifique o email {maskEmail(email)} para obter um código de verificação.{" "}
          <button
            type="button"
            onClick={() => navigate("/auth/forgot-password")}
            className="text-green underline font-semibold cursor-pointer"
          >
            Alterar
          </button>
        </p>

        <FormField>
          <Label htmlFor="code">Código</Label>
          <InputField
            type="text"
            id="code"
            placeholder="Digite o código recebido por e-mail"
            autoComplete="one-time-code"
            {...register("code")}
          />
          {errors.code && (
            <span className="text-red-500 text-sm">{errors.code.message}</span>
          )}
        </FormField>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="text-green text-sm font-semibold mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reenviar o código
        </button>

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold mt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-biege font-semibold px-6 py-3 w-full rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verificando..." : "Verificar"}
          </button>
          <p className="text-xs text-gray-500 text-center font-normal">
            Se você não encontrar o e-mail na sua caixa de entrada, verifique a pasta de spam. Se
            não estiver lá, o endereço de e-mail pode não ter sido confirmado ou não corresponder
            a uma conta existente no Alumni.
          </p>
          <button type="button" onClick={() => navigate("/auth/forgot-password")} className="text-green cursor-pointer">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
