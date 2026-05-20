import { Button } from "../../components/Button/Button";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Label } from "../../components/Label/Label";
import { Typography } from "../../components/Typography/Typography";

export function LoginForm() {
  return (
    <form action="" className="w-[500px] mx-auto">
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
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="pass">Senha</Label>
          <InputField type="password" id="pass" name="password" placeholder="Digite sua senha" required />
        </FormField>
      </div>

      <div className="flex justify-end font-semibold">
        <a href="#">Esqueci minha senha</a>
      </div>

      <div className="flex flex-col gap-4 w-[260px] items-center mx-auto font-semibold">
        <Button variant='primary' type="submit">Entrar</Button>
        <Typography variant="p">
          Não possui conta? <a className="text-green" href="#">Cadastrar-se</a> 
        </Typography>
      </div>
    </form>
  );
}
