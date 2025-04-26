import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daily-Copilot",
  description: "Assistente para reuniões de daily stand-up",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-slate-800 text-white p-4">
            <div className="container mx-auto">
              <h1 className="text-2xl font-bold">Daily-Copilot</h1>
              <p className="text-slate-300">Assistente para reuniões de daily stand-up</p>
            </div>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-slate-800 text-white p-4 text-center">
            <div className="container mx-auto text-sm">
              <p>© 2025 Daily-Copilot - Versão 1.0</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
