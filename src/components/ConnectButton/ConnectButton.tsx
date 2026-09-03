import { Button } from "../Button/Button";
import type { ConnectStatus } from "../../hooks/useConnection";

const LABELS: Record<ConnectStatus, string> = {
  idle: "Conectar",
  pending: "Enviando...",
  sent: "Solicitado",
  connected: "Conectado",
  error: "Tentar de novo",
};

export function ConnectButton({
  status,
  onClick,
  className = "",
}: {
  status: ConnectStatus;
  onClick: () => void;
  className?: string;
}) {
  const disabled = status === "pending" || status === "sent" || status === "connected";

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
