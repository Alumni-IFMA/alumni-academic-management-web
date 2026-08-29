import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { setPassword } from "../../services/authService";

const schema = yup.object({
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .test("no-spaces", "Senha não pode conter apenas espaços", (value) => Boolean(value && value.trim().length > 0)),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

interface SetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordFormValues>({ resolver: yupResolver(schema) });

  async function onSubmit({ password }: SetPasswordFormValues) {
    if (!token) {
      toast.error("Link inválido ou expirado. Solicite um novo e-mail.");
      return;
    }

    try {
      await setPassword({ token, newPassword: password });
      toast.success("Senha definida com sucesso!");
      navigate("/auth/login");
    } catch (error) {
      console.error("Erro ao definir senha:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Não foi possível definir a senha. O link pode ter expirado.");
    }
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col w-full max-w-[380px] mx-auto items-center px-4">
        <Typography variant="h1" className="!text-3xl sm:!text-4xl text-center mb-4">Definir senha</Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[380px] mx-auto px-4">
        <div className="grid gap-2">
          <FormField>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <InputField
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Digite sua senha"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-green cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Digite a senha novamente"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-dark-green cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </FormField>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold mt-7">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-biege font-semibold px-6 py-3 w-full rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" onClick={() => navigate("/auth/login")} className="text-green cursor-pointer">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
