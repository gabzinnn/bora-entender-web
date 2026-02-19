import {
  ArrowRight,
  CheckCircle,
  FilePenLine,
  Gift,
  Goal,
  MonitorCheck,
  PlayCircle,
  ShieldCheck,
  Smile,
  Sparkles,
  Timer,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Botao } from "./components/Botao";
import { PublicContainer, PublicFooter, PublicHeader } from "./components/PublicSiteLayout";

const showConnectedStudents = false;

const studentFeatures = [
  {
    title: "Aulas Dinâmicas",
    description: "Vídeos objetivos e explicações visuais para manter o foco e acelerar a compreensão.",
    icon: PlayCircle,
  },
  {
    title: "Exercícios Práticos",
    description: "Atividades com aplicação real para fixar conteúdo e ganhar confiança para as provas.",
    icon: FilePenLine,
  },
  {
    title: "Didática com sistema de recompensas",
    description: "Cada avanço rende reconhecimento e mantém o aluno motivado durante a jornada.",
    icon: Gift,
  },
  {
    title: "Espaço para dúvidas",
    description: "Canal direto para perguntar e receber apoio sem travar nos pontos mais difíceis.",
    icon: MessageCircle,
  },
];

const parentsFeatures = [
  {
    title: "Acompanhamento das metas",
    description: "Visualize o progresso por objetivos e acompanhe cada conquista com clareza.",
    icon: Goal,
  },
  {
    title: "Monitoramento de atividade",
    description: "Painel com frequência e desempenho para entender a rotina de estudos do aluno.",
    icon: MonitorCheck,
  },
  {
    title: "Praticidade na rotina",
    description: "Conteúdo organizado e trilhas guiadas para simplificar o dia a dia da família.",
    icon: Timer,
  },
  {
    title: "Ambiente seguro",
    description: "Plataforma estruturada para foco em educação, com acompanhamento responsável.",
    icon: ShieldCheck,
  },
];

function Hero() {
  return (
    <section className="w-full bg-bg-primary py-12 lg:py-20">
      <PublicContainer>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
            <h1 className="font-heading text-primary text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight">
              Entender nunca foi tão simples
            </h1>
            <p className="text-black text-lg sm:text-xl leading-relaxed max-w-160 mx-auto lg:mx-0">
              A plataforma que fala a sua língua. Com um ensino de aluno para aluno, domine as matérias da escola de
              um jeito simples, rápido e sem complicações.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/cadastroAluno" className="sm:w-auto w-full">
                <Botao variant="secondary" size="lg" rightIcon={ArrowRight} fullWidth className="sm:w-auto">
                  Começar agora
                </Botao>
              </Link>
              <Link href="/precos" className="sm:w-auto w-full">
                <Botao variant="primary" size="lg" fullWidth className="sm:w-auto">
                  Ver planos
                </Botao>
              </Link>
            </div>

            {showConnectedStudents && (
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold text-text-secondary">+2.000 alunos conectados</p>
              </div>
            )}
          </div>

          <div className="flex-1 w-full max-w-160 lg:max-w-none">
            <div
              className="aspect-square lg:aspect-4/3 w-full rounded-2xl bg-cover bg-center overflow-hidden shadow-lg"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80')",
              }}
            />
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}

function FeatureColumn({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: typeof studentFeatures;
}) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ title: itemTitle, description, icon: Icon }) => (
          <div key={itemTitle} className="flex flex-col bg-white/80 p-5 rounded-xl border border-[#f5c9a8] shadow-sm md:h-60 h-full">
            <div className="w-11 h-11 bg-brand-red/10 rounded-lg flex items-center justify-center text-brand-red mb-4 shrink-0">
              <Icon className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-text-primary mb-2">{itemTitle}</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="w-full bg-[#feede0] py-16 lg:py-24">
      <PublicContainer>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-text-primary font-heading text-3xl sm:text-4xl font-bold mb-4">
            Entendemos suas necessidades e entregamos a solução
          </h2>
          <p className="text-text-secondary text-lg max-w-3xl mx-auto">
            Metodologia e infraestrutura focada em quem quer aprender sem complicação e do seu jeito.
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="hidden lg:block absolute left-1/2 top-0 h-full w-px bg-[#f5c9a8] -translate-x-1/2" />

          <FeatureColumn
            title="Para alunos"
            subtitle="Foco total no aprendizado com ritmo leve e evolução constante."
            items={studentFeatures}
          />

          <FeatureColumn
            title="Para pais"
            subtitle="Transparência e apoio para acompanhar cada etapa do desenvolvimento."
            items={parentsFeatures}
          />
        </div>
      </PublicContainer>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="w-full bg-bg-primary py-16 lg:py-24">
      <PublicContainer>
        <div className="bg-primary/10 rounded-lg p-8 sm:p-10 lg:p-16 flex flex-col items-center text-center">
          <h2 className="font-heading text-primary text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl">
            Pronto para entender as matérias de verdade?
          </h2>
          <p className="text-text-primary text-lg mb-10 max-w-2xl">
            Temos planos para diferentes perfis de alunos e famílias, com uma jornada clara para aprender no seu
            ritmo.
          </p>

          <Link href="/precos">
            <Botao variant="secondary" size="lg" rightIcon={ArrowRight}>
              Nossos planos
            </Botao>
          </Link>
        </div>
      </PublicContainer>
    </section>
  );
}

function WelcomeStrip() {
  return (
    <section className="bg-bg-primary py-8">
      <PublicContainer>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-bg-tertiary rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-primary-alt" />
            <span className="font-medium text-text-primary">Trilhas por matéria e nível escolar</span>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-4 flex items-center gap-3">
            <Smile className="w-5 h-5 text-primary" />
            <span className="font-medium text-text-primary">Didática simples e linguagem direta</span>
          </div>
          <div className="bg-bg-tertiary rounded-xl p-4 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-brand-red" />
            <span className="font-medium text-text-primary">Aprendizado leve, prático e contínuo</span>
          </div>
        </div>
      </PublicContainer>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-display antialiased overflow-x-hidden">
      <div className="relative flex min-h-screen w-full flex-col">
        <PublicHeader />
        <Hero />
        <WelcomeStrip />
        <Features />
        <CallToAction />
        <PublicFooter />
      </div>
    </div>
  );
}
