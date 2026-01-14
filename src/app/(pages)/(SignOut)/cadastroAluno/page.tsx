'use client';
import { Botao } from "@/app/components/Botao";
import { Dropdown, type DropdownOption } from "@/app/components/Dropdown";
import { Input } from "@/app/components/Input";
import { Modal, useModal } from "@/app/components/Modals/Modal";
import api from "@/services/axios";
import { Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

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
});

export default function CadastroAluno() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const modal = useModal();

    const initialValues = {
        nome: "",
        email: "",
        senha: "",
        anoEscolar: "",
        nivelEnsino: "",
        DT_nascimento: "",
    }

    async function handleSubmit(values: typeof initialValues) {
        setIsLoading(true);
        try {
            const response = await api.post("/aluno", {
                anoEscolar: Number(values.anoEscolar),
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
                "Conta criada com sucesso!",
                "Sua conta foi criada. Agora você pode fazer login e começar a aprender.",
                () => router.push("/pagamento")
            );
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Ocorreu um erro ao criar sua conta. Tente novamente.";
            modal.error("Erro ao criar conta", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

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
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">Crie sua conta!</h1>
            <h3 className="text-sm sm:text-md font-medium text-text-secondary text-center">Bem-vindo ao Bora Entender!</h3>
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
                            placeholder="Sua senha"
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
                        
                        <Botao
                            variant="primary"
                            type="submit"
                            size="lg"
                            className="mt-4 w-full"
                            isLoading={isLoading}
                        >
                            Cadastrar
                        </Botao>
                    </form>
                    )
                }
            </Formik>
            
            {/* Link para login */}
            <p className="text-sm text-text-secondary mt-4">
                Já tem uma conta?{" "}
                <a href="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                    Entrar
                </a>
            </p>
        </div>
        
        {/* Footer links */}
        <div className="mt-6 flex gap-6 text-sm text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Ajuda</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
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