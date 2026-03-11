// src/components/Footer.tsx
"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#001f5f] to-[#ff5f00] rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AbTech-Digital</span>
            </div>
            <p className="text-gray-400">
              "Agence Digitale & Tech – Votre transformation en Afrique."
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/#services" className="hover:text-[#ff5f00] transition-colors">Conception & Développement</Link></li>
              <li><Link href="/#services" className="hover:text-[#ff5f00] transition-colors">Design & Identité</Link></li>
              <li><Link href="/#services" className="hover:text-[#ff5f00] transition-colors">Installation & Assistance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Formation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/cours-en-ligne" className="hover:text-[#ff5f00] transition-colors">Cours en ligne</Link></li>
              <li><Link href="/cours-presentiel" className="hover:text-[#ff5f00] transition-colors">Cours en Présentiel</Link></li>
              <li><Link href="/#cours" className="hover:text-[#ff5f00] transition-colors">Programme Métier Digital</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/confidentialite" className="hover:text-[#ff5f00] transition-colors">Confidentialité</Link></li>
              <li><Link href="/conditions" className="hover:text-[#ff5f00] transition-colors">Conditions d'utilisation</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} AbTech-Digital. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
