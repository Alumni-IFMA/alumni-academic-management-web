import { InputField } from "../../components/InputField";
import { FormField } from "../../components/FormField";
import { Label } from "../../components/Label";
import { Dropdown } from "../../components/Dropdown";
import { Button } from "../../components/Button";
import { Typography } from "../../components/Typography";

export function RegisterForm({ modalities, graduationYears, campus }) {
  return (
    <form action="">
      <FormField>
        <Label htmlFor="name">Nome completo</Label>
        <InputField
          type="text"
          id="name"
          placeholder="Digite o nome"
          name="name"
          required
        />
      </FormField>
      <FormField>
        <Label htmlFor="email">Email pessoal</Label>
        <InputField
          type="email"
          id="email"
          name="email"
          placeholder="exemplo@email.com"
          autoComplete="email"
          maxLength={50}
        />
      </FormField>
      <FormField>
        <Label htmlFor="modality">Modalidade</Label>
        <Dropdown itens={modalities} id="modality" name="modality" />
      </FormField>
      <FormField>
        <Label htmlFor="graduationYear">Ano de finalização</Label>
        <Dropdown
          itens={graduationYears}
          id="graduationYear"
          name="graduationYear"
          required
        />
      </FormField>
      <FormField>
        <Label htmlFor="cpf">CPF</Label>
        <InputField
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          inputMode="numeric"
          maxLength={14}
          autoComplete="off"
          required
        />
      </FormField>
      <FormField>
        <Label htmlFor="campus">Campus</Label>
        <Dropdown itens={campus} id="campus" name="campus" required />
      </FormField>
      <FormField>
        <Label htmlFor="yearEntry">
          Ano de ingresso (do último curso finalizado)
        </Label>
        <Dropdown
          itens={graduationYears}
          id="yearEntry"
          name="yearEntry"
          required
        />
      </FormField>
      <div>
        <Button type="submit">Cadastrar-se</Button>
        <Typography variant="p">
          Já possui conta? <a href="#">Entrar</a>
        </Typography>
      </div>
    </form>
  );
}
