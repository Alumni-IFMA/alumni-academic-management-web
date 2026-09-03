import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { FormField } from "../FormField/FormField";
import { InputField } from "../InputField/InputField";
import { Textarea } from "../Textarea/Textarea";
import { Label } from "../Label/Label";
import { sendMessage } from "../../services/supportService";

const feedbackFormSchema = yup.object({
  subject: yup.string().trim().required("Assunto é obrigatório"),
  message: yup.string().trim().required("Mensagem é obrigatória"),
});

type FeedbackFormValues = yup.InferType<typeof feedbackFormSchema>;

export function FeedbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: yupResolver(feedbackFormSchema),
    defaultValues: { subject: "", message: "" },
  });

  if (!isOpen) return null;

  async function onSubmit(data: FeedbackFormValues) {
    try {
      await sendMessage({ subject: data.subject.trim(), message: data.message.trim() });
      toast.success("Feedback enviado com sucesso!");
      reset();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      toast.error("Não foi possível enviar seu feedback. Tente novamente.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 w-full max-w-md">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-lg">Enviar feedback</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="feedback-subject">Assunto</Label>
            <InputField id="feedback-subject" placeholder="Assunto" {...register("subject")} />
            {errors.subject && <span className="text-red-500 text-sm">{errors.subject.message}</span>}
          </FormField>

          <FormField>
            <Label htmlFor="feedback-message">Mensagem</Label>
            <Textarea
              id="feedback-message"
              placeholder="Conte pra gente o que achou do seu curso"
              rows={5}
              {...register("message")}
            />
            {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}
          </FormField>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
