'use client';
import { Botao } from "@/app/components/Botao";
import { Dropdown, type DropdownOption } from "@/app/components/Dropdown";
import { Input } from "@/app/components/Input";
import Logo from "@/app/components/Logo";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import api from "@/services/axios";
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

// ponytail: página avulsa, sem link em nenhum menu — só pra compartilhar o link direto.
// Mesmos componentes/identidade visual do /cadastroAluno.

const niveisEnsino: DropdownOption[] = [
    { value: "EF", label: "Ensino Fundamental (1º ao 9º ano)" },
    { value: "EM", label: "Ensino Médio" },
];

const validationSchema = Yup.object().shape({
    nome: Yup.string().required("O nome é obrigatório"),
    email: Yup.string().email("Email inválido").required("O email é obrigatório"),
    senha: Yup.string().min(6, "A senha deve ter pelo menos 6 caracteres").required("A senha é obrigatória"),
    DT_nascimento: Yup.date().required("A data de nascimento é obrigatória"),
    nivelEnsino: Yup.string().required("O nível de ensino é obrigatório"),
    anoEscolar: Yup.number().required("O ano escolar é obrigatório").min(1, "Ano escolar inválido").max(12, "Ano escolar inválido"),
    escola: Yup.string().required("A escola é obrigatória"),
});

const initialValues = {
    nome: "",
    email: "",
    senha: "",
    anoEscolar: "",
    escola: "",
    nivelEnsino: "",
    DT_nascimento: "",
};

export default function InscricaoRapida() {
    const [isLoading, setIsLoading] = useState(false);
    const modal = useModal();

    async function handleSubmit(values: typeof initialValues) {
        setIsLoading(true);
        try {
            await api.post("/aluno", {
                anoEscolar: Number(values.anoEscolar),
                escola: values.escola,
                nivelEnsino: values.nivelEnsino,
                DT_nascimento: new Date(values.DT_nascimento),
                dados_usuario: {
                    nome: values.nome,
                    email: values.email,
                    senha: values.senha,
                    role: "ALUNO",
                }
            });
            modal.success(
                "Inscrição realizada!",
                "Recebemos seus dados com sucesso. Em breve entraremos em contato."
            );
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Ocorreu um erro ao enviar sua inscrição. Tente novamente.";
            modal.error("Erro ao enviar", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-bg-secondary items-center justify-center flex flex-col p-4">
            <Logo size="xxl" variant="completo" className="mb-6" />
            <div className="bg-white w-full max-w-md md:max-w-lg flex flex-col gap-2 px-6 py-6 sm:px-8 sm:py-8 items-center shadow-md rounded-lg">
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Inscrição</h1>
                <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center">Preencha seus dados para se inscrever</h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
                            <Input
                                label="Nome completo"
                                name="nome"
                                placeholder="Seu nome completo"
                                value={values.nome}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.nome}
                                error={touched.nome ? errors.nome : undefined}
                            />
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
                                placeholder="Crie uma senha"
                                value={values.senha}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.senha}
                                error={touched.senha ? errors.senha : undefined}
                            />
                            <Input
                                label="Data de Nascimento"
                                name="DT_nascimento"
                                type="date"
                                value={values.DT_nascimento}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.DT_nascimento}
                                error={touched.DT_nascimento ? errors.DT_nascimento : undefined}
                            />
                            <Dropdown
                                label="Nível de Ensino"
                                name="nivelEnsino"
                                placeholder="Selecione o nível de ensino"
                                options={niveisEnsino}
                                value={values.nivelEnsino}
                                onChange={(value) => setFieldValue("nivelEnsino", value)}
                                touched={touched.nivelEnsino}
                                error={touched.nivelEnsino ? errors.nivelEnsino : undefined}
                                searchable
                            />
                            <Input
                                label="Ano Escolar"
                                name="anoEscolar"
                                numericOnly
                                maxLength={2}
                                placeholder="Ex: 9"
                                value={values.anoEscolar}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.anoEscolar}
                                error={touched.anoEscolar ? errors.anoEscolar : undefined}
                                helperText="Digite o ano que você está cursando"
                            />
                            <Input
                                label="Escola"
                                name="escola"
                                placeholder="Nome da escola"
                                value={values.escola}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                touched={touched.escola}
                                error={touched.escola ? errors.escola : undefined}
                            />

                            <Botao
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="mt-4 w-full"
                                isLoading={isLoading}
                            >
                                Enviar inscrição
                            </Botao>
                        </form>
                    )}
                </Formik>
            </div>

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
