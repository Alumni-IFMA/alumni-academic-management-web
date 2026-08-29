import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, Toaster } from "sonner";
import { InputField } from "../../components/InputField/InputField";
import { FormField } from "../../components/FormField/FormField";
import { Label } from "../../components/Label/Label";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import userService from "../../services/userService";
import type { CampusCourse } from "../../services/campusCourseService";
import { registerFormSchema } from "./registerFormSchema";

interface RegisterFormProps {
  campusCourses: CampusCourse[];
  campuses: { id: string; name: string }[];
  graduationYears: { id: number; name: number }[];
  disabled: boolean;
}

interface RegisterFormValues {
  name: string;
  cpf: string;
  email: string;
  campus: string;
  modality: string;
  lastCourse: string;
  graduationYear: string;
  yearEntry: string;
}

export function RegisterForm({ campusCourses, campuses, graduationYears, disabled }: RegisterFormProps) {
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerFormSchema) as unknown as Resolver<RegisterFormValues>,
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      campus: "",
      modality: "",
      lastCourse: "",
      graduationYear: "",
      yearEntry: "",
    },
  });

  const selectedCampus = watch("campus");
  const selectedModality = watch("modality");
  const graduationYear = watch("graduationYear");

  const availableModalities = [
    ...new Set(
      campusCourses
        .filter((cc) => cc.campusName === selectedCampus)
        .map((cc) => cc.modality)
    ),
  ].map((modality) => ({ id: modality, name: modality }));

  const availableCourses = campusCourses
    .filter(
      (cc) => cc.campusName === selectedCampus && cc.modality === selectedModality
    )
    .map((cc) => ({ id: cc.id, name: cc.courseName }));

  const entryYears = graduationYear
    ? graduationYears.filter((y) => y.id <= +graduationYear)
    : graduationYears;

  useEffect(() => {
    setValue("modality", "");
    setValue("lastCourse", "");
  }, [selectedCampus, setValue]);

  useEffect(() => {
    setValue("lastCourse", "");
  }, [selectedModality, setValue]);

  useEffect(() => {
    setValue("yearEntry", "");
  }, [graduationYear, setValue]);

  async function onSubmit(data: RegisterFormValues) {
    setSuccessMessage(false);

    const payload = {
      name: data.name.trim(),
      cpf: data.cpf,
      email: data.email.trim(),
      campusCourseId: Number(data.lastCourse),
      entryYear: Number(data.yearEntry),
      conclusionYear: Number(data.graduationYear),
    };

    try {
      await userService.register(payload);
      setSuccessMessage(true);
      reset();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Não foi possível concluir o cadastro. Tente novamente.");
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 px-4 sm:px-20 gap-x-6 gap-y-2 mt-2">
          <FormField>
            <Label htmlFor="name">Nome completo</Label>
            <InputField
              type="text"
              id="name"
              placeholder="Digite o nome"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="cpf">CPF</Label>
            <InputField
              type="text"
              id="cpf"
              placeholder="000.000.000-00"
              inputMode="numeric"
              maxLength={14}
              autoComplete="off"
              {...register("cpf")}
            />
            {errors.cpf && (
              <span className="text-red-500 text-sm">{errors.cpf.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="email">Email pessoal</Label>
            <InputField
              type="email"
              id="email"
              placeholder="exemplo@email.com"
              autoComplete="email"
              maxLength={50}
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="campus">Campus</Label>
            <Controller
              name="campus"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Dropdown items={campuses} id="campus" bordered {...field} />
              )}
            />
            {errors.campus && (
              <span className="text-red-500 text-sm">{errors.campus.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="modality">Modalidade</Label>
            <Controller
              name="modality"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Dropdown
                  items={availableModalities}
                  id="modality"
                  bordered
                  disabled={!selectedCampus}
                  {...field}
                />
              )}
            />
            {errors.modality && (
              <span className="text-red-500 text-sm">{errors.modality.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="lastCourse">Último curso realizado</Label>
            <Controller
              name="lastCourse"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Dropdown
                  items={availableCourses}
                  id="lastCourse"
                  disabled={!selectedModality}
                  bordered
                  {...field}
                />
              )}
            />
            {errors.lastCourse && (
              <span className="text-red-500 text-sm">{errors.lastCourse.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="graduationYear">Ano de finalização</Label>
            <Controller
              name="graduationYear"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Dropdown items={graduationYears} id="graduationYear" bordered {...field} />
              )}
            />
            {errors.graduationYear && (
              <span className="text-red-500 text-sm">{errors.graduationYear.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="yearEntry">Ano de ingresso (do último curso finalizado)</Label>
            <Controller
              name="yearEntry"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Dropdown
                  items={entryYears}
                  id="yearEntry"
                  disabled={!graduationYear}
                  bordered
                  {...field}
                />
              )}
            />
            {errors.yearEntry && (
              <span className="text-red-500 text-sm">{errors.yearEntry.message}</span>
            )}
          </FormField>
        </div>

        {successMessage && (
          <Typography variant="p" className="text-green-600 text-center mt-4">
            Cadastro realizado! Aguarde a aprovação do administrador.
          </Typography>
        )}

        <div className="flex flex-col gap-4 w-full max-w-[260px] items-center mx-auto font-semibold px-4">
          <Button variant="primary" type="submit" disabled={disabled || isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
          </Button>
          <Typography variant="p">
            Já possui conta? <Link className="text-green" to="/auth/login">Entrar</Link>
          </Typography>
        </div>
      </form>
    </>
  );
}