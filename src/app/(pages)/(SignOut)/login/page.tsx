'use client';
import Image from "next/image";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input } from "@/app/components/Input";
import { Botao } from "@/app/components/Botao";
import { useRouter } from "next/navigation";
import api from "@/services/axios";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import { useAuth } from "@/app/context/authContext";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("O email é obrigatório"),
    senha: Yup.string().required("A senha é obrigatória"),
});

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const modal = useModal();
    const initialValues = {
        email: "",
        senha: "",
    }
    const { user, signIn } = useAuth();

    const handleSubmit = async (values: typeof initialValues) => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", {
                email: values.email,
                password: values.senha,
            });

            const { access_token, payload, needsPayment, assinaturaExpirada } = response.data;

            // Redireciona conforme status da assinatura
            if (needsPayment) {
                const mensagem = assinaturaExpirada 
                    ? "Sua assinatura expirou. Renove para continuar acessando."
                    : "Você ainda não possui uma assinatura ativa. Escolha um plano para começar!";

                modal.warning(
                    "Assinatura necessária",
                    mensagem,
                    () => router.push(`/pagamento?userId=${payload.id}`)
                );
            } else {
                signIn && signIn(access_token, payload);
                modal.success(
                    "Login realizado!",
                    "Você fez login com sucesso.",
                    () => router.push("/aluno")
                );
            }
        }
        catch (error: any) {
            modal.error(
                "Erro ao fazer login",
                error.response?.data?.message || "Email ou senha incorretos. Por favor, tente novamente."
            );
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (user && user.id !== 0) {
            router.push("/aluno");
        }
    }, [user, router]);

    return (
      <div className="w-full min-h-screen bg-bg-secondary items-center justify-center flex flex-col p-4">
        <Image
            src="/assets/images/logoCompleto.png"
            alt="Bora Entender Logo"
            width={200}
            height={100}
            className="mb-6"
        />
        <div className="bg-white w-full max-w-md md:max-w-lg flex flex-col gap-2 px-6 py-6 sm:px-8 sm:py-8 items-center shadow-md rounded-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Faça Login!</h1>
            <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center">Bem-vindo de volta ao Bora Entender!</h3>
            <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="exemplo@email.com"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.email}
                            error={touched.email ? errors.email : undefined}
                        />
                        <Input
                            label="Senha"
                            name="senha"
                            isPassword
                            placeholder="Sua senha"
                            value={values.senha}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.senha}
                            error={touched.senha ? errors.senha : undefined}
                        />
                        <Botao
                            variant="primary"
                            type="submit"
                            size="lg"
                            className="mt-4 w-full"
                            isLoading={isLoading}
                        >
                            Entrar
                        </Botao>
                    </form>
                )}
            </Formik>
            
            <p className="text-sm text-text-secondary mt-4">
                Não tem uma conta?{" "}
                <a href="/cadastroAluno" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                    Criar conta
                </a>
            </p>
        </div>

        {/* Modal */}
        <Modal
            isOpen={modal.isOpen}
            onClose={modal.close}
            type={modal.options.type}
            title={modal.options.title}
            message={modal.options.message}
            primaryButton={modal.options.primaryButton}
            secondaryButton={modal.options.secondaryButton}
        />
      </div>  
    );
}