import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AbTech-Digital - Agence Informatique & Services Digitaux",
  description: "AbTech-Digital est une agence informatique et services digitaux. Nous aidons les particuliers et entreprises à créer des solutions numériques modernes et efficaces. Proposons également des formations en informatique et Digital.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}