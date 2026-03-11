// src/app/confidentialite/page.tsx
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

export default function Confidentialite() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header simple */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex-1 min-w-0 flex justify-start">
            <Logo className="w-[700px] max-w-full h-auto" />
          </div>
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-[#001f5f] font-medium flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </Link>
          </div>
      </header>

      {/* Contenu */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001f5f] mb-8">Politique de Confidentialité</h1>
          
          <div className="prose prose-slate max-w-none prose-headings:text-[#001f5f] prose-a:text-[#ff5f00]">
            <p><strong>Dernière mise à jour :</strong> 07 Mars 2026</p>

            <h2>1. Introduction</h2>
            <p>
              Bienvenue sur AbTech-Digital. Nous accordons une grande importance à la confidentialité et à la sécurité de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre site web et nos services (formations, boutique, prestations).
            </p>

            <h2>2. Données collectées</h2>
            <p>Nous pouvons collecter les informations suivantes :</p>
            <ul>
              <li><strong>Informations d'identification :</strong> Nom, prénom, adresse e-mail, numéro de téléphone.</li>
              <li><strong>Informations de facturation :</strong> Adresse de livraison, détails des commandes (les informations de paiement direct sont gérées par nos prestataires sécurisés et ne sont pas stockées sur nos serveurs).</li>
              <li><strong>Données de connexion :</strong> Adresse IP, type de navigateur, temps de navigation pour l'amélioration de nos services.</li>
            </ul>

            <h2>3. Utilisation de vos données</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul>
              <li>Gérer vos commandes sur la boutique et vos inscriptions aux formations.</li>
              <li>Vous donner accès à votre tableau de bord étudiant.</li>
              <li>Vous contacter concernant vos achats ou des mises à jour importantes.</li>
              <li>Améliorer l'expérience utilisateur de notre plateforme.</li>
            </ul>

            <h2>4. Protection et partage des données</h2>
            <p>
              AbTech-Digital s'engage à ne jamais vendre, louer ou échanger vos données personnelles à des tiers à des fins commerciales. Vos données sont stockées sur des serveurs sécurisés. L'accès à ces données est strictement limité aux employés d'AbTech-Digital qui en ont besoin pour effectuer leur travail (service client, facturation).
            </p>

            <h2>5. Utilisation des cookies</h2>
            <p>
              Notre site utilise des cookies (notamment via notre système d'authentification) pour maintenir votre session active, sauvegarder votre panier d'achat et analyser le trafic global du site. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.
            </p>

            <h2>6. Vos droits</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles. Vous pouvez exercer ce droit à tout moment en modifiant vos informations depuis votre espace profil, ou en nous contactant directement.
            </p>

            <h2>7. Nous contacter</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité, veuillez nous contacter à :<br/>
              <strong>Email :</strong> contact@abtechdigital.tg<br/>
              <strong>Téléphone :</strong> +228 90 56 50 86
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-950 py-8 text-center text-gray-400">
        © {new Date().getFullYear()} AbTech-Digital. Tous droits réservés.
      </footer>
    </div>
  );
}