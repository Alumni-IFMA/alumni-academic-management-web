import { Button } from "../Button/Button";

const LABELS = {
  idle: "Conectar",
  pending: "Enviando...",
  sent: "Solicitado",
  error: "Tentar de novo",
};

export function ConnectButton({ status, onClick, className = "" }) {
  const disabled = status === "pending" || status === "sent";

  return (
    <Button
      variant="connect"
      onClick={onClick}
      disabled={disabled}
      aria-label={status === "sent" ? "Solicitação de conexão enviada" : "Conectar"}
      className={`${status === "error" ? "bg-red-700 hover:bg-red-800" : "hover:bg-green"} ${className}`}
    >
      {LABELS[status]}
    </Button>
  );
}