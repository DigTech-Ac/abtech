// src/app/conditions/page.tsx
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft } from "lucide-react";

export default function Conditions() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-[#001f5f] mb-8">Conditions Générales d'Utilisation et de Vente</h1>
          
          <div className="prose prose-slate max-w-none prose-headings:text-[#001f5f] prose-a:text-[#ff5f00]">
            <p><strong>Dernière mise à jour :</strong> 07 Mars 2026</p>

            <h2>1. Objet</h2>
            <p>
              Les présentes Conditions Générales régissent l'utilisation du site web AbTech-Digital ainsi que l'achat de produits (physiques et digitaux) et la souscription aux formations (en ligne et en présentiel) proposés par l'agence.
            </p>

            <h2>2. Accès à la plateforme et Compte client</h2>
            <p>
              L'accès à certains services (formations en ligne, achats de produits digitaux) nécessite la création d'un compte. Vous êtes responsable de la confidentialité de vos identifiants de connexion. AbTech-Digital ne saurait être tenu responsable en cas d'utilisation frauduleuse de votre compte suite à une négligence de votre part.
            </p>

            <h2>3. Achat de Produits</h2>
            <ul>
              <li><strong>Produits physiques :</strong> Les prix sont indiqués en Francs CFA (XOF). Les frais de livraison sont précisés lors de la commande. Les retours sont acceptés sous 7 jours en cas de défaut matériel avéré.</li>
              <li><strong>Produits digitaux (Codes sources, logiciels) :</strong> En raison de la nature immatérielle de ces produits, aucun remboursement n'est possible une fois le lien de téléchargement fourni.</li>
            </ul>

            <h2>4. Formations en ligne et Présentiel</h2>
            <ul>
              <li><strong>Accès :</strong> L'inscription à une formation en ligne vous donne un accès personnel et non transférable aux contenus vidéos et textuels. Le partage de compte est strictement interdit.</li>
              <li><strong>Propriété intellectuelle :</strong> Tous les supports de cours, vidéos, et codes sources partagés pendant les formations sont la propriété exclusive d'AbTech-Digital. Toute reproduction, revente ou diffusion publique sans accord préalable est interdite.</li>
            </ul>

            <h2>5. Paiement</h2>
            <p>
              Les paiements en ligne sont sécurisés via nos partenaires financiers (Mobile Money, Carte Bancaire). Pour les produits physiques, le paiement à la livraison peut être proposé. La commande n'est validée qu'après réception effective du paiement.
            </p>

            <h2>6. Limitation de responsabilité</h2>
            <p>
              AbTech-Digital s'efforce de maintenir la plateforme accessible 24h/24 et 7j/7, mais ne peut garantir une disponibilité ininterrompue. Nous ne serons pas tenus responsables des dommages indirects liés à l'utilisation de la plateforme ou à l'impossibilité d'y accéder.
            </p>

            <h2>7. Droit applicable</h2>
            <p>
              Les présentes conditions sont régies par la loi en vigueur en République Togolaise et dans l'espace OHADA. En cas de litige, une solution à l'amiable sera privilégiée avant tout recours devant les tribunaux compétents.
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