import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast, Toaster } from "sonner";
import alumni from "../../assets/alumni-ifma.png";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { setPassword } from "../../services/authService";

const schema = yup.object({
  password: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .test("no-spaces", "Senha não pode conter apenas espaços", (value) => value && value.trim().length > 0),
  confirmPassword: yup
    .string()
    .required("Confirmação de senha é obrigatória")
    .oneOf([yup.ref("password")], "As senhas não coincidem"),
});

export function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit({ password }) {
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
      toast.error(
        error.response?.data?.message ??
          "Não foi possível definir a senha. O link pode ter expirado."
      );
    }
  }

  return (
    <div>
      <Toaster position="top-center" richColors />

      <div className="flex flex-col w-full max-w-[500px] mx-auto items-center px-4">
        <img
          src={alumni}
          alt="Logo do Alumni IFMA"
          className="mb-6 w-[200px] h-auto sm:w-[300px] sm:h-[100px]"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-[500px] mx-auto px-4">
        <div className="grid gap-2">
          <FormField>
            <Label htmlFor="password">Senha</Label>
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

          <FormField>
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <InputField
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Digite a senha novamente"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </FormField>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-biege font-semibold px-6 py-3 w-full rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Salvando..." : "Salvar"}
          </button>
          <button type="button" onClick={() => navigate("/auth/login")} className="text-green">
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
