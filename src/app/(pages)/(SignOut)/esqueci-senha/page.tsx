'use client';
import { Botao } from "@/app/components/Botao";
import { Input } from "@/app/components/Input";
import Logo from "@/app/components/Logo";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import api from "@/services/axios";
import { Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("O email é obrigatório"),
});

export default function EsqueciSenha() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const modal = useModal();
    const initialValues = {
        email: "",
    }

    const handleSubmit = async (values: typeof initialValues) => {
        setIsLoading(true);
        try {
            await api.patch("/auth/esqueci-senha", {
                email: values.email,
            });
            modal.success(
                "Código enviado!",
                "Verifique seu email para o código de recuperação.",
                () => router.push("/esqueci-senha/codigo?email=" + encodeURIComponent(values.email))
            );
        }
        catch (error: any) {
            modal.error(
                "Erro ao enviar código",
                error.response?.data?.message || "Ocorreu um erro ao enviar o código. Por favor, tente novamente."
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
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Esqueceu a senha?</h1>
            <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center">Insira seu email para receber o código de recuperação.</h3>
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
                    <Botao
                        variant="primary"
                        type="submit"
                        size="lg"
                        className="mt-4 w-full"
                        isLoading={isLoading}
                    >
                        Enviar Código
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