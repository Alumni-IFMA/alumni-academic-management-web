import { Typography } from "../../../components/Typography/Typography";

export function AboutSection({ bio }: { bio?: string }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <Typography variant="h3" className="mb-2">
        Sobre
      </Typography>
      <p className="text-sm text-gray-600 leading-relaxed">
        {bio || "Este usuário ainda não adicionou uma biografia."}
      </p>
    </section>
  );
}
