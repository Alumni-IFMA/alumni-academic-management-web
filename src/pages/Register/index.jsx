import { Button } from "../../components/Button";
import seta from '../../assets/back-button-register.png'

export function Register() {
  return (
      <div className="container">
        <div className="register-card">
            <Button>
                <img src={seta} alt="Seta para esquerda" />
            </Button>
        </div>
      </div>
  );
}
