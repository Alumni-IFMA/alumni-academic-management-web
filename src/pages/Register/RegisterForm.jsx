import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, Toaster } from "sonner";
import { InputField } from "../../components/InputField/InputField";
import { FormField } from "../../components/FormField/FormField";
import { Label } from "../../components/Label/Label";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import userService from "../../services/userService";
import { registerFormSchema } from "./registerFormSchema";

export function RegisterForm({ campusCourses, campuses, graduationYears, disabled }) {
  const [successMessage, setSuccessMessage] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerFormSchema),
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

  async function onSubmit(data) {
    setSuccessMessage(false);

    const payload = {
      name: data.name.trim(),
      cpf: data.cpf,
      email: data.email.trim(),
      campusCourseId: data.lastCourse,
      entryYear: data.yearEntry,
      conclusionYear: data.graduationYear,
    };

    try {
      await userService.register(payload);
      setSuccessMessage(true);
      reset();
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error(
        error.response?.data?.message ??
          "Não foi possível concluir o cadastro. Tente novamente."
      );
    }
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col">
        <div className="grid grid-cols-2 px-20 gap-4 mt-3">
          <FormField>
            <Label htmlFor="name">Nome completo</Label>
            <InputField
              type="text"
              id="name"
              name="name"
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
              name="cpf"
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
              name="email"
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

        <div className="flex flex-col gap-4 w-[260px] items-center mx-auto font-semibold">
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