import { Button } from "../Button/Button.jsx";

const LABELS = {
  idle: "Conectar",
  pending: "Enviando...",
  sent: "Solicitado",
  error: "Tentar de novo",
};

export function ConnectButton({ status, onClick }) {
  const disabled = status === "pending" || status === "sent";

  return (
    <Button
      variant="connect"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        status === "sent" ? "Solicitação de conexão enviada" : "Conectar"
      }
      className={
        status === "error" ? "bg-red-700 hover:bg-red-800" : "hover:bg-green"
      }
    >
      {LABELS[status]}
    </Button>
  );
}
