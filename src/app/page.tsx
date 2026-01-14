'use client';
import { FilePenLine, GraduationCap, MessageCircle, PlayCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Botao } from "./components/Botao";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Sobre", href: "#" },
  { label: "Cursos", href: "#" },
  { label: "Preços", href: "#" },
];

const features = [
  {
    title: "Aulas Dinâmicas",
    description:
      "Aprenda com vídeos curtos e diretos ao ponto, sem enrolação. Ideal para revisar antes da prova.",
    icon: PlayCircle,
  },
  {
    title: "Exercícios Práticos",
    description:
      "Teste seu conhecimento com quizzes divertidos e ganhe recompensas a cada acerto.",
    icon: FilePenLine,
  },
  {
    title: "Tire Dúvidas",
    description:
      "Monitores disponíveis para te ajudar a qualquer hora do dia. Nunca mais fique travado na lição.",
    icon: MessageCircle,
  },
];

const footerColumns = [
  {
    title: "Plataforma",
    links: ["Cursos", "Preços", "Mentoria"],
  },
  {
    title: "Suporte",
    links: ["Central de Ajuda", "Termos de Uso", "Privacidade"],
  },
  {
    title: "Social",
    links: ["Instagram", "TikTok", "Twitter"],
  },
];

const avatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBWTyw5o0kLJHPyrMPhv5LKebgvRrrVSC-6IravpV9La_AW5xyuVfWZLJ3gLIRg8vIpH5PDvGhEiCRa2EjCGv1HW98wOaHLrXZ590l0X0J9ADmgu9EXNkEJRKdAXaZgH4qpVb54aM_e8bRlzWJTtPn-C20PUtx_4pHEFF82hnT5JST3jtqjpB3GGiCY2kdb4WbIxZN7vv-FzDHjj2EnB0Ra3ocUAmVrqHWan-XP63uaorL4RYKE545W1ODn7uwPMx32GFjxOgIuxQYi",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDvh2JA09xbUJ2qPO3ZsuBhsWIdID4peYZ5B9d595whgA8yGXhIFnaSoL5-8d_k3A9PSxrX75A0mpWbrcaZoXaDBr1A3lYhaUphhNa7dKY-oVApVefk9mH0Hx1gWIXupqcKhmaR4pYG_dx_wcqqYcJQ0Z14q-ICbhNM-lwivQpiYcoRyVrtUcOMHzwZEnxxdJDw834_vvotj_P19-zuAZliLBRMh5aKAjrpGRtz8naa6QZdiQEu1mMBpVFo3-GFSX0o3_S6cZtUXm1N",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB9wgAYEO-wYJgLjfNyursCLlTXzZTm0-SvSoTcZARHnixxjTFLkXFZ-HyFSonW2--WLpDIMsCvxP4Mv7YnmHM4GxkVU7JDiyE6nF5KbE5D0dcyQZBOOaxFUZtu_Skv2Xtj-cjByLaagJMis2Sa9yxZ_Qz6gBdjBhm4p-kpsdbXXhA_GprX-ILEm7zxazsDb1bXYsI4yb6_lApS44tYCK_5fTLS45tQBXI7wu3BYhq0_9tR0Oi4MkMV-sZwHBVS8f9VxN9iXAvIIKwV",
];

function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>;
}

function Header() {
  const router = useRouter();
  return (
    <header className="w-full bg-bg-primary border-b border-border-lighter">
      <Container className="py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/assets/images/logoCompleto.png" alt="Bora Entender Logo" width={105} height={50} />
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="text-text-primary hover:text-primary font-medium text-sm transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <a className="text-text-primary font-bold text-sm hover:text-primary transition-colors" href="#">
            Login
          </a>
          <Botao variant="secondary" size="sm" onClick={() => router.push("/cadastroAluno")}>
            Criar conta
          </Botao>
        </div>
      </Container>
    </header>
  );
}

function Hero() {
  return (
    <section className="w-full bg-bg-primary py-12 lg:py-20">
      <Container>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
            <h1 className="font-heading text-primary text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight">
              Aprender nunca foi tão divertido
            </h1>
            <p className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-150 mx-auto lg:mx-0">
              A plataforma que fala a sua língua. Domine as matérias da escola de um jeito simples, rápido e sem
              complicação.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Botao variant="secondary" size="lg" rightIcon={ArrowRight} fullWidth className="sm:w-auto">
                Começar agora
              </Botao>
              <Botao variant="primary" size="lg" fullWidth className="sm:w-auto">
                Ver cursos
              </Botao>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
              <div className="flex -space-x-3">
                {avatars.map((src, index) => (
                  <div
                    key={src}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-gray-200 bg-cover"
                    style={{ backgroundImage: `url('${src}')`, zIndex: 10 - index }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-text-secondary">+2.000 alunos conectados</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-150 lg:max-w-none">
            <div
              className="aspect-square lg:aspect-4/3 w-full rounded-lg bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCq1tm0SeDcF2YD8gquJ9BPaazs0Y8H-wHstqBjv_o3flMDVuPsVvuFVPzs5o3vwvcfAhmVdYiop17xzaV-MWuJKgGNtZjkhjUPAyyEj2Wj3kDkenszZu7lGnA2upmEtzXS6xXabbYtobSrjr4MnGjiPQh1chpXtWE_guk5G7hlKtrz6dc2A1bHzbLmWH6ytBrW3nvrdZvkstr8S5WseWcimWbq74ksHGSpXUgBwp9hDnQo67qzR2kZ-xN7CB0tRK_0U3nC_c-lII0W')",
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function Features() {
  return (
    <section className="w-full bg-bg-quaternary py-16 lg:py-24">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-text-primary font-heading text-3xl sm:text-4xl font-bold mb-4">
            Tudo o que você precisa
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Metodologia focada em quem quer aprender sem complicação e do seu jeito.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="bg-white p-6 sm:p-8 rounded-lg border-2 border-transparent hover:border-primary transition-colors duration-300"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-6">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
              <p className="text-text-secondary leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="w-full bg-bg-primary py-16 lg:py-24">
      <Container>
        <div className="bg-primary/10 rounded-lg p-8 sm:p-10 lg:p-16 flex flex-col items-center text-center">
          <h2 className="font-heading text-primary text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl">
            Pronto para melhorar suas notas?
          </h2>
          <p className="text-text-primary text-lg mb-10 max-w-2xl">
            Junte-se a milhares de estudantes que já estão aprendendo com a gente e descubra que estudar não precisa ser
            chato.
          </p>
          <Botao variant="secondary" size="lg" rightIcon={ArrowRight}>
            Criar conta grátis
          </Botao>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-bg-primary border-t border-border-lighter pt-12 sm:pt-16 pb-8">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4 pr-0 lg:pr-8">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-7 w-7" />
              <span className="font-bold text-xl text-text-primary">Bora Entender</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              A plataforma de estudos feita para você. Simples, direta e divertida.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3 sm:gap-4">
              <h4 className="font-bold text-text-primary">{column.title}</h4>
              {column.links.map((link) => (
                <a
                  key={link}
                  className="text-text-secondary hover:text-primary text-sm transition-colors"
                  href="#"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border-lighter text-center">
          <p className="text-text-secondary text-sm">© 2026 Bora Entender. Todos os direitos reservados.</p>
        </div>
      </Container>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-display antialiased overflow-x-hidden">
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <Hero />
        <Features />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}