import { Button } from "../../components/Button";
import seta from "../../assets/back-button-register.png";
import { Typography } from "../../components/Typography";

export function Register() {
  return (
    <div className="container">
      <div className="register-card">
        <Button>
          <img src={seta} alt="Seta para esquerda" />
        </Button>
        <Typography variant="h1">Bem-vindo!</Typography>
      </div>
    </div>
  );
}
