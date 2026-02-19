import Link from "next/link";
import Logo from "../Logo";
import { Botao } from "../Botao";
import { PublicNavigation } from "./PublicNavigation";

export const publicNavLinks = [
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Cursos", href: "/cursos" },
  { label: "Preços", href: "/precos" },
];

const footerColumns = [
  {
    title: "Plataforma",
    links: [
      { label: "Cursos", href: "/cursos" },
      { label: "Preços", href: "/precos" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Nossa história", href: "/nossa-historia" },
      { label: "Quem somos", href: "/quem-somos" },
      { label: "Contato", href: "mailto:contato@boraentender.com" },
    ],
  },
  {
    title: "Acesso",
    links: [
      { label: "Login", href: "/login" },
      { label: "Criar conta", href: "/cadastroAluno" },
      { label: "Esqueci a senha", href: "/esqueci-senha" },
    ],
  },
];

export function PublicContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PublicHeader() {
  return (
    <header className="w-full bg-bg-primary border-b border-border-lighter">
      <PublicContainer className="py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Página inicial Bora Entender">
          <Logo size="lg" variant="completo" />
        </Link>

        <PublicNavigation />

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            className="font-montserrat text-text-primary font-semibold text-base sm:text-lg hover:text-primary transition-colors"
            href="/login"
          >
            Login
          </Link>
          <Link href="/cadastroAluno">
            <Botao variant="secondary" size="sm" className="font-montserrat text-base px-5">
              Criar conta
            </Botao>
          </Link>
        </div>
      </PublicContainer>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="w-full bg-bg-primary border-t border-border-lighter pt-12 sm:pt-16 pb-8">
      <PublicContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10 sm:mb-12">
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-4 pr-0 lg:pr-8">
            <Link href="/" className="w-fit" aria-label="Página inicial Bora Entender">
              <Logo size="lg" variant="completo" />
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              A plataforma de estudos feita para você. Simples, direta e sem complicações.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3 sm:gap-4">
              <h4 className="font-bold text-text-primary">{column.title}</h4>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  className="text-text-secondary hover:text-primary text-sm transition-colors"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-border-lighter text-center">
          <p className="text-text-secondary text-sm">© 2026 Bora Entender. Todos os direitos reservados.</p>
        </div>
      </PublicContainer>
    </footer>
  );
}
