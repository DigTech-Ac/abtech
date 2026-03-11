// src/app/admin/content/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Save, Globe, Mail, Phone, MapPin, Home, FileText, Settings, Image, Loader2, Plus, Trash2, Star, Upload
} from "lucide-react";
import { getSiteContent, updateSiteContentSection } from "@/actions/content.actions";

const sections =[
  { id: "hero", name: "Hero (Accueil)", icon: Home },
  { id: "about", name: "À propos", icon: FileText },
  { id: "services", name: "Services", icon: Settings },
  { id: "testimonials", name: "Témoignages", icon: Star },
  { id: "contact", name: "Contact", icon: Mail },
];

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState("hero");
  const[saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const[heroContent, setHeroContent] = useState({
    title: "Transformez votre avenir numérique avec AbTech-Digital",
    subtitle: "Agence informatique et services digitaux. Nous aidons les particuliers et entreprises à créer des solutions numériques modernes et efficaces.",
    ctaText: "Commencer",
    ctaLink: "/formations"
  });

  const[aboutContent, setAboutContent] = useState({
    title: "À propos de AbTech-Digital",
    description: "AbTech-Digital est une agence informatique et services digitaux basée en Côte d'Ivoire. Nous accompagnons les particuliers et entreprises dans leur transformation digitale.",
    mission: "Notre mission est de rendre la technologie accessible à tous."
  });

  const[contactContent, setContactContent] = useState({
    email: "contact@abtech.com",
    phone: "+228 90 56 50 86",
    address: "Lomé, TOGO",
    facebook: "https://facebook.com/abtech",
    instagram: "https://instagram.com/abtech",
    linkedin: "https://linkedin.com/company/abtech"
  });

  // NOUVEAU : State pour les services
  const [servicesContent, setServicesContent] = useState<any[]>([]);

  // NOUVEAU : State pour les témoignages
  const[testimonialsContent, setTestimonialsContent] = useState<any[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      const result = await getSiteContent();
      if (result.success && result.content) {
        if (result.content.hero) setHeroContent(result.content.hero);
        if (result.content.about) setAboutContent(result.content.about);
        if (result.content.contact) setContactContent(result.content.contact);
        // Si on a des services en base de données, on les charge, sinon on met un tableau vide
        if (result.content.services) setServicesContent(result.content.services);
        // NOUVEAU :
        if (result.content.testimonials) setTestimonialsContent(result.content.testimonials);
      }
      setIsLoading(false);
    };
    fetchContent();
  },[]);

  const handleSave = async () => {
    setSaving(true);
    
    let dataToSave;
    if (activeSection === "hero") dataToSave = heroContent;
    else if (activeSection === "about") dataToSave = aboutContent;
    else if (activeSection === "contact") dataToSave = contactContent;
    else if (activeSection === "services") dataToSave = servicesContent;
    else if (activeSection === "testimonials") dataToSave = testimonialsContent; // NOUVEAU

    if (dataToSave) {
      const result = await updateSiteContentSection(activeSection, dataToSave);
      if (result.success) {
        alert("Contenu enregistré avec succès !");
      } else {
        alert("Erreur lors de la sauvegarde : " + result.error);
      }
    }
    
    setSaving(false);
  };

  // Fonctions pour gérer la liste des services
  const addService = () => {
    setServicesContent([
      ...servicesContent, 
      { title: "", description: "", category: "Conception & Développement", icon: "Laptop", image: "" }
    ]);
  };

  const removeService = (index: number) => {
    setServicesContent(servicesContent.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: string) => {
    const newServices = [...servicesContent];
    newServices[index][field] = value;
    setServicesContent(newServices);
  };

  // Fonctions pour gérer les témoignages
  const addTestimonial = () => {
    setTestimonialsContent([
      ...testimonialsContent, 
      { name: "", role: "", content: "", rating: 5, image: "" }
    ]);
  };

  const removeTestimonial = (index: number) => {
    setTestimonialsContent(testimonialsContent.filter((_, i) => i !== index));
  };

  const updateTestimonial = (index: number, field: string, value: any) => {
    const newTestimonials = [...testimonialsContent];
    newTestimonials[index][field] = value;
    setTestimonialsContent(newTestimonials);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#001f5f]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion du Contenu</h1>
          <p className="text-slate-600">Modifiez le contenu de votre site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 h-fit">
          <h3 className="font-semibold text-slate-900 mb-4">Sections</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeSection === section.id
                    ? "bg-[#001f5f] text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.name}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Sections existantes (Hero, About, Contact) - Raccourcies pour la lisibilité */}
          {activeSection === "hero" && (
             <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
               {/* ... (Garde ton code existant pour le hero ici) ... */}
               <h2 className="text-xl font-semibold text-slate-900 mb-4">Hero (Accueil)</h2>
               <input type="text" value={heroContent.title} onChange={e => setHeroContent({...heroContent, title: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
               <textarea rows={3} value={heroContent.subtitle} onChange={e => setHeroContent({...heroContent, subtitle: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
             </div>
          )}

          {activeSection === "about" && (
             <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
               <h2 className="text-xl font-semibold text-slate-900 mb-4">À propos</h2>
               <input type="text" value={aboutContent.title} onChange={e => setAboutContent({...aboutContent, title: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
               <textarea rows={4} value={aboutContent.description} onChange={e => setAboutContent({...aboutContent, description: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
               <textarea rows={3} value={aboutContent.mission} onChange={e => setAboutContent({...aboutContent, mission: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
             </div>
          )}

          {activeSection === "contact" && (
             <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
               <h2 className="text-xl font-semibold text-slate-900 mb-4">Contact</h2>
               <input type="email" value={contactContent.email} onChange={e => setContactContent({...contactContent, email: e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4 outline-none" />
               <input type="text" value={contactContent.phone} onChange={e => setContactContent({...contactContent, phone: e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4 outline-none" />
               <input type="text" value={contactContent.address} onChange={e => setContactContent({...contactContent, address: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none" />
             </div>
          )}

          {/* NOUVEAU : Section Services */}
          {activeSection === "services" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-[#001f5f]" />
                  <h2 className="text-xl font-semibold text-slate-900">Section Services</h2>
                </div>
                <button onClick={addService} className="flex items-center gap-2 px-4 py-2 bg-[#001f5f] text-white rounded-lg text-sm font-medium hover:bg-[#001a4d]">
                  <Plus className="w-4 h-4" /> Ajouter un service
                </button>
              </div>
              
              <div className="space-y-6">
                {servicesContent.map((service, index) => (
                  <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <button 
                      onClick={() => removeService(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Titre du service</label>
                        <input type="text" value={service.title} onChange={(e) => updateService(index, "title", e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                        <input type="text" value={service.category} onChange={(e) => updateService(index, "category", e.target.value)} placeholder="Ex: Conception & Développement" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                      <textarea rows={2} value={service.description} onChange={(e) => updateService(index, "description", e.target.value)} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'icône</label>
                        <input type="text" value={service.icon} onChange={(e) => updateService(index, "icon", e.target.value)} placeholder="Ex: Laptop, Smartphone, Monitor" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                        <p className="text-xs text-slate-500 mt-1">Nom d'une icône Lucide React (en anglais)</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Image d'illustration (URL)</label>
                        <input type="url" value={service.image} onChange={(e) => updateService(index, "image", e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {servicesContent.length === 0 && (
                  <p className="text-center text-slate-500 py-8">Aucun service défini. Cliquez sur "Ajouter un service".</p>
                )}
              </div>
            </div>
          )}

          {/* NOUVEAU : Section Témoignages */}
          {activeSection === "testimonials" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#001f5f]" />
                  <h2 className="text-xl font-semibold text-slate-900">Avis Clients</h2>
                </div>
                <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 bg-[#001f5f] text-white rounded-lg text-sm font-medium hover:bg-[#001a4d]">
                  <Plus className="w-4 h-4" /> Ajouter un avis
                </button>
              </div>
              
              <div className="space-y-6">
                {testimonialsContent.map((testimonial, index) => (
                  <div key={index} className="p-6 bg-slate-50 border border-slate-200 rounded-xl relative">
                    <button 
                      onClick={() => removeTestimonial(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4 pr-10">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom du client</label>
                        <input type="text" value={testimonial.name} onChange={(e) => updateTestimonial(index, "name", e.target.value)} placeholder="Ex: Koffi Jean" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Rôle / Entreprise</label>
                        <input type="text" value={testimonial.role} onChange={(e) => updateTestimonial(index, "role", e.target.value)} placeholder="Ex: PDG chez TechAfrique" className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <textarea rows={3} value={testimonial.content} onChange={(e) => updateTestimonial(index, "content", e.target.value)} placeholder="Le message du client..." className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Note (sur 5)</label>
                        <input type="number" min="1" max="5" value={testimonial.rating} onChange={(e) => updateTestimonial(index, "rating", parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Photo de profil (URL)</label>
                        <input type="url" value={testimonial.image} onChange={(e) => updateTestimonial(index, "image", e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#001f5f]" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {testimonialsContent.length === 0 && (
                  <p className="text-center text-slate-500 py-8">Aucun avis client. Cliquez sur "Ajouter un avis".</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}