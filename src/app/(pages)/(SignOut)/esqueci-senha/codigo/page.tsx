'use client';
import { Botao } from "@/app/components/Botao";
import Logo from "@/app/components/Logo";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import api from "@/services/axios";
import { Formik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
    codigo: Yup.string()
        .length(6, "O código deve ter 6 caracteres")
        .required("O código é obrigatório")
        .matches(/^[A-Z0-9]{6}$/, "O código deve conter apenas letras e números"),
});

export default function ValidarCodigo() {
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const modal = useModal();

    const initialValues = {
        codigo: "",
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendCountdown > 0) {
            interval = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCountdown]);

    const handleSubmit = async (values: typeof initialValues) => {
        setIsLoading(true);
        try {
            await api.post("/auth/validar-codigo", {
                email: email,
                token: values.codigo,
            });
            modal.success(
                "Código validado!",
                "Você será redirecionado para resetar sua senha.",
                () => router.push("/esqueci-senha/nova-senha?email=" + encodeURIComponent(email))
            );
        }
        catch (error: any) {
            modal.error(
                "Código inválido",
                error.response?.data?.message || "O código digitado está incorreto. Verifique e tente novamente."
            );
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            await api.patch("/auth/esqueci-senha", {
                email: email,
            });
            modal.success(
                "Código reenviado!",
                "Verifique seu email para o novo código de recuperação.",
                () => {
                    setResendCountdown(60);
                }
            );
        }
        catch (error: any) {
            modal.error(
                "Erro ao reenviar código",
                error.response?.data?.message || "Ocorreu um erro ao reenviar o código. Por favor, tente novamente."
            );
        }
        finally {
            setIsResending(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-bg-secondary items-center justify-center flex flex-col p-4">
            <Logo size="xxl" variant="completo" className="mb-6" />
            <div className="bg-white w-full max-w-md md:max-w-lg flex flex-col gap-2 px-6 py-6 sm:px-8 sm:py-8 items-center shadow-md rounded-lg">
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Confirme seu código</h1>
                <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center mb-4">
                    Enviamos um código de 6 caracteres para <strong>{email}</strong>
                </h3>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-text-primary">Código de recuperação</label>
                                <input
                                    type="text"
                                    name="codigo"
                                    placeholder="ABC123"
                                    value={values.codigo}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase().slice(0, 6);
                                        setFieldValue('codigo', value);
                                    }}
                                    onBlur={handleBlur}
                                    maxLength={6}
                                    className={`w-full px-4 py-3 border-2 rounded-lg text-center text-2xl tracking-widest font-mono font-bold uppercase transition-colors ${
                                        touched.codigo && errors.codigo
                                            ? "border-error bg-red-50 text-error"
                                            : "border-border-light focus:border-primary focus:outline-none bg-bg-secondary"
                                    }`}
                                />
                                {touched.codigo && errors.codigo && (
                                    <span className="text-xs text-error mt-1">{errors.codigo}</span>
                                )}
                            </div>

                            <Botao
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="mt-4 w-full"
                                isLoading={isLoading}
                            >
                                Validar código
                            </Botao>
                        </form>
                    )}
                </Formik>

                <div className="w-full mt-6 pt-6 border-t border-border-light">
                    <p className="text-sm text-text-secondary text-center mb-3">Não recebeu o código?</p>
                    <Botao
                        variant="secondary"
                        size="md"
                        className="w-full"
                        onClick={handleResendCode}
                        isLoading={isResending}
                        disabled={resendCountdown > 0}
                    >
                        {resendCountdown > 0
                            ? `Reenviar em ${resendCountdown}s`
                            : "Reenviar código"
                        }
                    </Botao>
                </div>
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