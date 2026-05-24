import { Button } from "../../components/Button/Button";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  password: yup
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .required("Senha é obrigatória"),
});

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit({ email, password }) {
    try {
      await login(email, password);
      navigate("/");
    } catch {
      toast.error("Email ou senha inválidos.");
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-[500px] mx-auto">
      <div className="grid gap-2 mt-2">
        <FormField>
          <Label htmlFor="email">Email</Label>
          <InputField
            type="email"
            id="email"
            name="email"
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
          <InputField
           type="password" 
           id="password" 
           name="password" 
           placeholder="Digite sua senha" 
           {...register("password")} 
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </FormField>
      </div>

      <div className="flex justify-end font-semibold">
        <a href="#">Esqueci minha senha</a>
      </div>

      <div className="flex flex-col gap-4 w-[260px] items-center mx-auto font-semibold">
        <Button variant='primary' type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
        <Typography variant="p">
          Não possui conta? {" "}
          <a className="text-green" href="#">Cadastrar-se</a> 
        </Typography>
      </div>
    </form>
  );
}
