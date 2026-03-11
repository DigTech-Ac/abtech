// src/app/HomeClient.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight, CheckCircle, Phone, Mail, MapPin, Star,
  Award, TrendingUp, Laptop, Smartphone, Palette, PenTool,
  CreditCard, Wifi, Wrench, Monitor, Image, Code, Clock
} from "lucide-react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const[count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  },[isInView, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

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

function AnimatedImage({ src, alt, className = "" }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <motion.div ref={ref} initial={{ opacity: 0, scale: 1.2 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: "easeOut" }} className={className}><img src={src} alt={alt} className="w-full h-full object-cover" /></motion.div>;
}

const services =[
  { title: "Création de site web", description: "Sites web professionnels, responsives et optimisés pour le SEO.", icon: Laptop, image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop" },
  { title: "Développement d'application", description: "Applications web et mobiles sur mesure.", icon: Smartphone, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" },
  { title: "Création d'affiches", description: "Design d'affiches, bannières et visuels.", icon: Image, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop" },
  { title: "Conception de logos", description: "Logos uniques et mémorables.", icon: PenTool, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop" },
  { title: "Supports visuels", description: "Cartes de visite, flyers, catalogues.", icon: CreditCard, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop" },
  { title: "Installation Bureautique", description: "Mise en place et configuration d'équipements.", icon: Monitor, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop" },
  { title: "Wifi Zone", description: "Installation de points d'accès WiFi sécurisés.", icon: Wifi, image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop" },
  { title: "Support technique", description: "Maintenance préventive et curative.", icon: Wrench, image: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=400&h=300&fit=crop" },
];

export default function HomeClient({ 
  initialContent, 
  initialRecentCourses,
  paidCourseIds = []
}: { 
  initialContent: any, 
  initialRecentCourses: any[],
  paidCourseIds?: string[]
}) {
  const content = initialContent || {};
  const recentCourses = initialRecentCourses || [];

  return (
    <>
      <section className="relative w-full min-h-[400px] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop')" }}></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="banner-animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transformez Votre Vision en <span className="text-orange-500">Réalité</span>
            </h1>
          </div>
          <div className="banner-animate-delay-1">
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Découvrez comment nos solutions digitales peuvent propulser votre entreprise vers de nouveaux sommets.
            </p>
          </div>
          <div className="banner-animate-delay-2">
            <Link href="/register" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:shadow-xl hover:shadow-orange-500/30 transform hover:scale-105">
              Commencer Maintenant
            </Link>
          </div>
        </div>
      </section>

      <section id="accueil" className="relative pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-pink-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="text-center lg:text-left" delay={0}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#001f5f] mb-6 leading-tight">
                {content?.hero?.title || (
                  <>
                    <span className="text-orange-500 font-normal">Bienvenue</span> à
                    <br /><span className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-[#001f5f] to-[#ff5f00]">l'Agence</span>
                    <br />INFORMATIQUE & DIGITAL
                    <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#001f5f] to-[#ff5f00]">AbTech-Digital</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0">
                {content?.hero?.subtitle || "Nous aidons particuliers et entreprises à créer des solutions numériques modernes. Formations en ligne et en présentiel."}
              </p>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-[#001f5f] font-bold">Plus de 10 000 étudiants formés en ligne</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /><span className="text-[#001f5f] font-bold">Plus de 1000 formés en Présentiel</span></div>
              </div>
              <Link href={content?.hero?.ctaLink || "/a-propos"} className="inline-flex bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg gap-2">
                {content?.hero?.ctaText || "En savoir Plus"} <ArrowRight className="w-5 h-5" />
              </Link>
            </AnimatedSection>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=500&fit=crop" alt="Étudiants" className="w-full h-auto object-cover" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl px-6 py-4">
                  <div className="text-3xl font-bold text-[#001f5f]"><CountUp end={15250} suffix="+" /></div>
                  <div className="text-sm font-semibold text-gray-600">ETUDIANTS SATISFAITS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] mx-auto mt-4"></div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <AnimatedCard key={index} delay={index * 0.1} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative h-40 overflow-hidden">
                  <AnimatedImage src={service.image} alt={service.title} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center">
                      <service.icon className="w-4 h-4 text-[#001f5f]" />
                    </div>
                    <span className="text-white font-semibold text-sm line-clamp-1">{service.title}</span>
                  </div>
                </div>
                <div className="p-4"><p className="text-gray-600 text-sm">{service.description}</p></div>
              </AnimatedCard>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section id="cours" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16" direction="down">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Cours</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] mx-auto mt-4"></div>
          </AnimatedSection>

          <AnimatedStagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentCourses.length > 0 ? recentCourses.map((course, index) => {
              const hasPaid = paidCourseIds.includes(course.id);
              return (
              <AnimatedCard key={course.id} delay={index * 0.1} className="bg-gray-50 rounded-2xl overflow-hidden shadow-md flex flex-col">
                <div className="relative h-40 bg-gray-200">
                  <img src={course.image || "/logo.png"} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {course.isFree ? "Gratuit" : `${course.price.toLocaleString()} CFA`}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                  </div>
                  {hasPaid ? (
                    <Link href={`/formations/${course.id}`} className="mt-auto w-full bg-green-600 text-white py-2 rounded-xl text-center font-semibold hover:bg-green-700 transition-colors">
                      Suivre
                    </Link>
                  ) : (
                    <Link href={course.isFree ? `/formations/${course.id}` : `/checkout-formation?course=${course.id}`} className="mt-auto w-full bg-[#001f5f] text-white py-2 rounded-xl text-center font-semibold hover:bg-[#ff5f00] transition-colors">
                      {course.isFree ? "Commencer" : "Acheter"}
                    </Link>
                  )}
                </div>
              </AnimatedCard>
              );
            }) : (
              <p className="col-span-full text-center text-gray-500">Aucune formation disponible pour le moment.</p>
            )}
          </AnimatedStagger>
          
          <div className="text-center mt-10">
            <Link href="/cours-en-ligne" className="inline-flex items-center gap-2 bg-white border-2 border-[#001f5f] text-[#001f5f] px-8 py-3 rounded-full font-semibold hover:bg-[#001f5f] hover:text-white transition-colors">
              Voir toutes nos formations <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="apropos" className="py-20 px-4 bg-gradient-to-br from-[#001f5f] to-[#ff5f00]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection direction="left">
            <h2 className="text-4xl font-bold text-white mb-6">{content?.about?.title || "Pourquoi choisir AbTech ?"}</h2>
            <p className="text-orange-100 text-lg mb-8">{content?.about?.description || "Nous accompagnons les entreprises africaines dans leur transformation digitale."}</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Award className="w-10 h-10 text-white mb-3" />
                <h4 className="text-white font-bold mb-2">Expertise Locale</h4>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <TrendingUp className="w-10 h-10 text-white mb-3" />
                <h4 className="text-white font-bold mb-2">Croissance Rapide</h4>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" alt="Equipe" className="rounded-3xl shadow-2xl" />
          </AnimatedSection>
        </div>
      </section>

      <section id="contact" className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <AnimatedSection direction="left">
            <h2 className="text-4xl font-bold text-white mb-6">Contactez-nous</h2>
            <p className="text-gray-400 text-lg mb-8">Une question ? Notre équipe est disponible pour vous accompagner.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#001f5f] rounded-full flex items-center justify-center"><Phone className="w-5 h-5 text-white" /></div>
                <div><p className="text-gray-400 text-sm">Téléphone</p><p className="text-white font-semibold">{content?.contact?.phone || "+228 90 56 50 86"}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#001f5f] rounded-full flex items-center justify-center"><Mail className="w-5 h-5 text-white" /></div>
                <div><p className="text-gray-400 text-sm">Email</p><p className="text-white font-semibold">{content?.contact?.email || "contact@abtech.tg"}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#001f5f] rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-white" /></div>
                <div><p className="text-gray-400 text-sm">Adresse</p><p className="text-white font-semibold">{content?.contact?.address || "Lomé, TOGO"}</p></div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right">
            <div className="bg-white rounded-2xl p-8">
              <form className="space-y-4">
                <input type="text" placeholder="Votre nom" className="w-full px-4 py-3 rounded-lg border focus:border-[#001f5f] outline-none" />
                <input type="email" placeholder="votre@email.com" className="w-full px-4 py-3 rounded-lg border focus:border-[#001f5f] outline-none" />
                <textarea rows={4} placeholder="Votre message..." className="w-full px-4 py-3 rounded-lg border focus:border-[#001f5f] outline-none"></textarea>
                <button type="button" className="w-full bg-[#001f5f] text-white py-4 rounded-lg font-semibold hover:bg-[#ff5f00] transition-colors">Envoyer le message</button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
