import "./globals.css";
import type { Metadata } from "next";
import AuthContextProvider from "./context/authContext";
import QueryProvider from "@/providers/QueryProvider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bora Entender",
  description: "Plataforma educacional para facilitar o aprendizado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`font-lexend antialiased`}
      >
        <QueryProvider>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
