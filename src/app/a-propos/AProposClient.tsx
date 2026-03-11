// src/app/a-propos/AProposClient.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, ArrowRight, CheckCircle, Target, Eye, Award, Users, TrendingUp, Shield, Heart, Lightbulb, Zap, MapPin, Phone, Mail } from "lucide-react";

const fadeInUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } };
const fadeInDown = { hidden: { opacity: 0, y: -60 }, visible: { opacity: 1, y: 0 } };
const fadeInLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } };
const fadeInRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } };
const scaleIn = { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

function AnimatedSection({ children, className = "", delay = 0, direction = "up" }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const getVariants = () => {
    switch(direction) { case "down": return fadeInDown; case "left": return fadeInLeft; case "right": return fadeInRight; case "scale": return scaleIn; default: return fadeInUp; }
  };
  return <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={getVariants()} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>{children}</motion.div>;
}

function AnimatedStagger({ children, className = "", delayChildren = 0.1 }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"} transition={{ staggerChildren: delayChildren }} className={className}>{children}</motion.div>;
}

function AnimatedCard({ children, className = "", delay = 0 }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return <motion.div ref={ref} variants={cardVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} transition={{ duration: 0.5, delay }} className={className}>{children}</motion.div>;
}

const values = [
  { icon: Award, title: "Excellence", description: "Nous visons l'excellence dans chaque projet, en offrant des solutions de qualité supérieure qui dépassent les attentes." },
  { icon: Users, title: "Collaboration", description: "Nous croyons en la puissance du travail d'équipe et construisons des partenariats durables avec nos clients." },
  { icon: Shield, title: "Fiabilité", description: "La confiance est au cœur de notre relation client. Nous tenons nos engagements et nos délais." },
  { icon: Lightbulb, title: "Innovation", description: "Nous restons à l'affût des dernières technologies pour offrir des solutions modernes et performantes." },
  { icon: Heart, title: "Passion", description: "La passion du digital nous pousse à donner le meilleur de nous-mêmes dans chaque projet." },
  { icon: TrendingUp, title: "Croissance", description: "Nous accompagnons nos clients vers la réussite en contribuant à leur croissance durable." }
];

const services = [
  { title: "Création de sites web", description: "Sites web professionnels, responsives et optimisés pour le SEO.", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop" },
  { title: "Développement d'applications", description: "Applications web et mobiles sur mesure pour toutes vos besoins.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop" },
  { title: "Design graphique", description: "Identité visuelle, logos, affiches et supports de communication.", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop" },
  { title: "Formation digitale", description: "Formations en ligne et en présentiel aux métiers du digital.", image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop" }
];

const stats = [
  { value: "10 000+", label: "Étudiants formés" },
  { value: "500+", label: "Projets realizzé" },
  { value: "50+", label: "Partenaires" },
  { value: "5+", label: "Ans d'expérience" }
];

const whyChooseUs = [
  { title: "Expertise locale", description: "Connaissance approfondie du marché africain et compréhension des enjeux locaux.", icon: MapPin },
  { title: "Support dédié", description: "Une équipe toujours disponible pour vous accompagner à chaque étape.", icon: Users },
  { title: "Résultats mesurables", description: "Des indicateurs clairs pour suivre la performance de vos projets.", icon: TrendingUp },
  { title: "Prix accessibles", description: "Des solutions adaptées à tous les budgets sans compromis sur la qualité.", icon: Shield }
];

export default function AProposClient({ initialContent }: { initialContent: any }) {
  const content = initialContent || {};

  return (
    <>
      <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 to-[#2563EB]/80"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection direction="down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              À propos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">AbTech-Digital</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection direction="up" delay={0.2}>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Votre partenaire de confiance pour la transformation digitale en Afrique
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <AnimatedStagger className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </AnimatedCard>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#2563EB] to-[#0F172A] rounded-3xl p-1">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop" alt="Équipe AbTech-Digital" className="rounded-3xl w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center"><Globe className="w-6 h-6 text-white" /></div>
                    <div><div className="text-2xl font-bold text-[#0F172A]">5+</div><div className="text-sm text-gray-500">Années d'expérience</div></div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right" delay={0.2}>
              <div className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4"><Users className="w-4 h-4" />Qui sommes-nous ?</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6">{content?.about?.title || "Une agence digitale au service de votre réussite"}</h2>
              <p className="text-gray-600 text-lg mb-6 whitespace-pre-line">{content?.about?.description || "AbTech-Digital est une agence informatique et services digitales basée au Togo."}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">Équipe expérimentée</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">Approche personnalisée</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-gray-700">Support réactif</span></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Notre mission & notre vision</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Nous croyons en un avenir numérique accessible à tous en Afrique</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedCard delay={0} className="bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-6"><Target className="w-8 h-8 text-white" /></div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Notre Mission</h3>
              <p className="text-gray-600 text-lg whitespace-pre-line">{content?.about?.mission || "Démocratiser l'accès au digital pour les particuliers et entreprises africaines."}</p>
            </AnimatedCard>
            <AnimatedCard delay={0.2} className="bg-white rounded-3xl p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mb-6"><Eye className="w-8 h-8 text-white" /></div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Notre Vision</h3>
              <p className="text-gray-600 text-lg">Devenir le leader de la transformation digitale en Afrique de l'Ouest.</p>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/10 text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4"><Zap className="w-4 h-4" />Ce que nous faisons</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Des solutions digitales complètes</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Nous accompagnons nos clients dans tous leurs projets de transformation digitale</p>
          </AnimatedSection>
          <AnimatedStagger className="grid md:grid-cols-2 gap-8" delayChildren={0.1}>
            {services.map((service, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="bg-[#F1F5F9] rounded-3xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4"><h3 className="text-xl font-bold text-white">{service.title}</h3></div>
                </div>
                <div className="p-6"><p className="text-gray-600">{service.description}</p></div>
              </AnimatedCard>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <div className="inline-flex items-center gap-2 bg-[#2563EB]/20 text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4"><Heart className="w-4 h-4" />Nos valeurs</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ce qui nous définit</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Les principes qui guident chacune de nos actions</p>
          </AnimatedSection>
          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" delayChildren={0.1}>
            {values.map((value, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mb-4"><value.icon className="w-7 h-7 text-white" /></div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </AnimatedCard>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <div className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4"><Shield className="w-4 h-4" />Pourquoi nous choisir</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Les avantages AbTech-Digital</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Découvrez pourquoi nos clients nous font confiance</p>
          </AnimatedSection>
          <AnimatedStagger className="grid md:grid-cols-2 gap-8" delayChildren={0.1}>
            {whyChooseUs.map((item, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="bg-[#F1F5F9] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center flex-shrink-0"><item.icon className="w-6 h-6 text-white" /></div>
                  <div><h3 className="text-xl font-bold text-[#0F172A] mb-2">{item.title}</h3><p className="text-gray-600">{item.description}</p></div>
                </div>
              </AnimatedCard>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#0F172A] to-[#2563EB]">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection direction="scale">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à transformer votre entreprise ?</h2>
            <p className="text-xl text-gray-200 mb-10">Rejoignez les nombreuses entreprises qui nous font confiance pour leur croissance digitale.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto bg-white text-[#0F172A] hover:bg-gray-100 px-10 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2">
                Commencer maintenant <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#contact" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-full font-semibold text-lg transition-all">
                Nous contacter
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Vous avez des questions ?</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">N'hésitez pas à nous contacter pour discuter de votre projet</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard delay={0} className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4"><MapPin className="w-7 h-7 text-white" /></div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Adresse</h3><p className="text-gray-600">{content?.contact?.address || "Lomé, TOGO"}</p>
            </AnimatedCard>
            <AnimatedCard delay={0.1} className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4"><Phone className="w-7 h-7 text-white" /></div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Téléphone</h3><p className="text-gray-600">{content?.contact?.phone || "+228 90 56 50 86"}</p>
            </AnimatedCard>
            <AnimatedCard delay={0.2} className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4"><Mail className="w-7 h-7 text-white" /></div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">Email</h3><p className="text-gray-600">{content?.contact?.email || "contact@abtech.tg"}</p>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </>
  );
}
