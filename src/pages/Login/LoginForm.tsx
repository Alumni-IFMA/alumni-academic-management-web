import { useState } from "react";
import { Button } from "../../components/Button/Button";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .required("Senha é obrigatória")  // ← Verifica vazio PRIMEIRO
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .test('no-spaces', 'Senha não pode conter apenas espaços', (value) => {
      return Boolean(value && value.trim().length > 0);  // ← Rejeita 6 espaços
    }),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(schema) });

  async function onSubmit({ email, password }: LoginFormValues) {
    try {
      await login(email, password);
      navigate("/home");
    } catch(error) {
      console.error("Erro no login:", error);
      toast.error("Email ou senha inválidos.");
    }
  }
  
  
  return (
    <>
    <Toaster position="top-center" richColors />
    
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[500px] mx-auto px-4">
      <div className="grid gap-2 mt-2">
        <FormField>
          <Label htmlFor="email">Email</Label>
          <InputField
            type="email"
            id="email"
            placeholder="Digite seu email"
            autoComplete="email"
            maxLength={50}
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </FormField>
        <FormField>
          <Label htmlFor="pass">Senha</Label>
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
      </div>

      <div className="flex justify-end font-semibold">
        <Link to="/auth/forgot-password">Esqueci minha senha</Link>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold">
        <Button variant='primary' type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
        <Typography variant="p">
          Não possui conta? {" "}
          <Link className="text-green" to="/auth/register">Cadastrar-se</Link>
        </Typography>
      </div>
    </form>
    </>
  );
}
