'use client';
import { Botao } from "@/app/components/Botao";
import { Input } from "@/app/components/Input";
import Logo from "@/app/components/Logo";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import api from "@/services/axios";
import { Formik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    novaSenha: Yup.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .required("A senha é obrigatória"),
    confirmarSenha: Yup.string()
        .oneOf([Yup.ref('novaSenha')], "As senhas não conferem")
        .required("A confirmação de senha é obrigatória"),
});

export default function NovaSenha() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const modal = useModal();
    
    const initialValues = {
        novaSenha: "",
        confirmarSenha: "",
    }

    const handleSubmit = async (values: typeof initialValues) => {
        setIsLoading(true);
        try {
            await api.patch("/auth/alterar-senha", {
                email: email,
                novaSenha: values.novaSenha,
            });
            modal.success(
                "Senha alterada com sucesso!",
                "Você será redirecionado para fazer login.",
                () => router.push("/login")
            );
        }
        catch (error: any) {
            modal.error(
                "Erro ao alterar senha",
                error.response?.data?.message || "Ocorreu um erro ao alterar a senha. Por favor, tente novamente."
            );
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
      <div className="w-full min-h-screen bg-bg-secondary items-center justify-center flex flex-col p-4">
        <Logo size="xxl" variant="completo" className="mb-6" />
        <div className="bg-white w-full max-w-md md:max-w-lg flex flex-col gap-2 px-6 py-6 sm:px-8 sm:py-8 items-center shadow-md rounded-lg">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Crie uma nova senha</h1>
            <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center">Insira uma nova senha para sua conta.</h3>
            <Formik 
                initialValues={initialValues} 
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
                    <Input
                        label="Nova Senha"
                        name="novaSenha"
                        type="password"
                        isPassword
                        placeholder="Digite sua nova senha"
                        value={values.novaSenha}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.novaSenha}
                        error={touched.novaSenha ? errors.novaSenha : undefined}
                    />
                    <Input
                        label="Confirmar Senha"
                        name="confirmarSenha"
                        isPassword
                        type="password"
                        placeholder="Confirme sua nova senha"
                        value={values.confirmarSenha}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.confirmarSenha}
                        error={touched.confirmarSenha ? errors.confirmarSenha : undefined}
                    />
                    <Botao
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="mt-4 w-full"
                        isLoading={isLoading}
                    >
                        Alterar Senha
                    </Botao>
                    </form>
                )}
            </Formik>
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