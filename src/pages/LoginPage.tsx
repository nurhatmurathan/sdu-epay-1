import {FC} from "react";
import {LoginForm} from "../components/auth/LoginForm.tsx";
import {Container} from "../ui/Container.tsx";

export const LoginPage:FC = () => {
    return (
        <Container className={"flex flex-col items-center w-full sm:w-fit gap-[20px] px-4"} >
            <img src="logo.png" alt="logo" className="w-full max-w-[200px] mx-auto sm:mx-0"/>
            <LoginForm />
        </Container>
    )
}