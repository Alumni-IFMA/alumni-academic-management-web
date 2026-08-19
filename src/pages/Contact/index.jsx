import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, Toaster } from "sonner";
import { FormField } from "../../components/FormField/FormField";
import { InputField } from "../../components/InputField/InputField";
import { Textarea } from "../../components/Textarea/Textarea";
import { Label } from "../../components/Label/Label";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { sendMessage } from "../../services/supportService";

const contactFormSchema = yup.object({
  subject: yup.string().trim().required("Assunto é obrigatório"),
  message: yup.string().trim().required("Mensagem é obrigatória"),
});

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(contactFormSchema),
    defaultValues: { subject: "", message: "" },
  });

  async function onSubmit(data) {
    try {
      await sendMessage({ subject: data.subject.trim(), message: data.message.trim() });
      toast.success("Mensagem enviada com sucesso!");
      reset();
    } catch (error) {
      console.error("Erro ao enviar mensagem de contato:", error);
      toast.error(
        error.response?.data?.message ??
          "Não foi possível enviar sua mensagem. Tente novamente."
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <Toaster position="top-center" richColors />

      <header className="text-center space-y-1 mb-8">
        <Typography variant="h1" className="!text-4xl sm:!text-5xl">
          Fale conosco
        </Typography>
        <Typography variant="p" className="!text-base sm:!text-lg">
          Nós estamos muito interessados no que você tem a dizer.
        </Typography>
      </header>

      <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <Typography variant="h2" className="mb-6 text-center !text-2xl sm:!text-4xl">
          Envie sua mensagem
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="subject">Assunto</Label>
            <InputField
              type="text"
              id="subject"
              name="subject"
              placeholder="Assunto"
              {...register("subject")}
            />
            {errors.subject && (
              <span className="text-red-500 text-sm">{errors.subject.message}</span>
            )}
          </FormField>

          <FormField>
            <Label htmlFor="message">Sua mensagem</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Sua mensagem"
              rows={6}
              {...register("message")}
            />
            {errors.message && (
              <span className="text-red-500 text-sm">{errors.message.message}</span>
            )}
          </FormField>

          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="mx-auto max-w-[260px]"
          >
            {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      </div>
    </div>
  );
}
