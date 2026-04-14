import { InputField } from "../../components/InputField/InputField";
import { FormField } from "../../components/FormField/FormField";
import { Label } from "../../components/Label/Label";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";

export function RegisterForm({ modalities, graduationYears, campus }) {
  return (
    <form action="" className="flex flex-col">
      <div className="grid grid-cols-2 px-20 gap-6 mt-6">
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
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="modality">Modalidade</Label>
          <Dropdown items={modalities} id="modality" name="modality" />
        </FormField>
        <FormField>
          <Label htmlFor="graduationYear">Ano de finalização</Label>
          <Dropdown
            items={graduationYears}
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
          <Dropdown items={campus} id="campus" name="campus" required />
        </FormField>
        <FormField>
          <Label htmlFor="yearEntry">
            Ano de ingresso (do último curso finalizado)
          </Label>
          <Dropdown
            items={graduationYears}
            id="yearEntry"
            name="yearEntry"
            required
          />
        </FormField>
      </div>

      <div className="flex flex-col gap-4 w-[230px] items-center mx-auto font-semibold">
        <Button variant='primary' type="submit">Cadastrar-se</Button>
        <Typography variant="p">
          Já possui conta? <a className="text-dark-green" href="#">Entrar</a> 
        </Typography>
      </div>
    </form>
  );
}
