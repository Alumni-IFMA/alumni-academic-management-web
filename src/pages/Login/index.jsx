import alumni from '../../assets/alumni-ifma.png'
import seta from "../../assets/back-button-register.png";
import { Button } from '../../components/Button/Button'
import { Typography } from '../../components/Typography/Typography';
import { LoginForm } from './LoginForm';

export function Login() {
    return (
        <div>
            <Button type="button">
                <img src={seta} alt="Voltar para a página anterior" />
            </Button>
            <div className='flex flex-col w-[500px] mx-auto items-center'>
                <img src={alumni} alt="Logo do Alumni IFMA" className='mb-10 w-[300px] h-[100px]' />
                <Typography variant="h1">Bem-vindo!</Typography>
            </div>
            <div>
                <LoginForm />
            </div>
        </div>
    )
}