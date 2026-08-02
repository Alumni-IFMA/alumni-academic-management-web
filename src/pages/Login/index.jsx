import { useNavigate } from 'react-router-dom';
import alumni from '../../assets/alumni-ifma.png'
import seta from "../../assets/back-button-register.png";
import { Button } from '../../components/Button/Button'
import { Typography } from '../../components/Typography/Typography';
import { LoginForm } from './LoginForm';

export function Login() {
    const navigate = useNavigate();

    return (
        <div className="relative">
            <Button
                type="button"
                variant="icon"
                onClick={() => navigate(-1)}
                className="absolute -top-2 -left-2 !w-10 !h-10"
            >
                <img src={seta} alt="Voltar para a página anterior" className="w-5 h-5" />
            </Button>
            <div className='flex flex-col w-full max-w-[500px] mx-auto items-center px-4'>
                <img src={alumni} alt="Logo do Alumni IFMA" className='mb-4 w-[200px] h-auto sm:w-[300px] sm:h-[100px]' />
                <Typography variant="h1" className="!text-3xl">Bem-vindo!</Typography>
            </div>
            <div>
                <LoginForm />
            </div>
        </div>
    )
}