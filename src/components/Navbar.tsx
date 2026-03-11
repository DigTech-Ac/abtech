// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import AuthButtons from "@/components/AuthButtons";
import { useCartStore } from "@/store/cart";
import { 
  ChevronDown, Laptop, Smartphone, Image as ImageIcon, PenTool, 
  CreditCard, Monitor, Wifi, Wrench, Building, Briefcase, Users2, 
  ShoppingCart, Menu, X, Plus, Minus
} from "lucide-react";

export default function Navbar() {
  const[mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  const { items: cart, updateQuantity, getTotal, getCount } = useCartStore();
  const cartTotal = getTotal();
  const cartCount = getCount();

  const goToCheckout = () => {
    setCartOpen(false);
    router.push("/checkout");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-50 w-full h-20 flex items-center">
      <div className="w-full flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-1 min-w-0 flex justify-start">
          <Logo className="w-[700px] max-w-full h-auto" />
        </div>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 flex-nowrap whitespace-nowrap flex-shrink-0 mr-6">
          <Link href="/" className={`font-medium transition-colors ${isActive('/') ? 'text-[#001f5f] font-bold' : 'text-gray-700 hover:text-[#001f5f]'}`}>Accueil</Link>
          
          {/* Services Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-[#001f5f] transition-colors font-medium py-2">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left z-50">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-bold text-[#001f5f] uppercase tracking-wider">Conception & Développement</div>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Laptop className="w-4 h-4 text-orange-500" /> Site web
                </Link>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Smartphone className="w-4 h-4 text-orange-500" /> Application
                </Link>
                <div className="my-2 border-t border-gray-100"></div>
                <div className="px-3 py-2 text-xs font-bold text-[#001f5f] uppercase tracking-wider">Design & Identité</div>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <ImageIcon className="w-4 h-4 text-pink-500" /> Affiches
                </Link>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <PenTool className="w-4 h-4 text-pink-500" /> Logos
                </Link>
                <div className="my-2 border-t border-gray-100"></div>
                <div className="px-3 py-2 text-xs font-bold text-[#001f5f] uppercase tracking-wider">Assistance</div>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Monitor className="w-4 h-4 text-green-500" /> Bureautique
                </Link>
                <Link href="/#services" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Wifi className="w-4 h-4 text-green-500" /> Wifi Zone
                </Link>
              </div>
            </div>
          </div>

          {/* Formations Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700 hover:text-[#001f5f] transition-colors font-medium py-2">
              Nos Cours <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-left z-50">
              <div className="p-2">
                <Link href="/cours-en-ligne" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Laptop className="w-5 h-5 text-orange-500" />
                  <div><div className="font-medium">Cours en ligne</div><div className="text-xs text-gray-500">Formation à distance</div></div>
                </Link>
                <Link href="/cours-presentiel" className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#001f5f] rounded-lg transition-colors">
                  <Building className="w-5 h-5 text-orange-500" />
                  <div><div className="font-medium">Cours en Présentiel</div><div className="text-xs text-gray-500">Dans nos locaux</div></div>
                </Link>
                <div className="my-2 border-t border-gray-100"></div>
                <Link href="/#cours" className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white rounded-lg hover:opacity-90 transition-colors">
                  <Users2 className="w-5 h-5" />
                  <div><div className="font-medium">Programme Métier Digital</div><div className="text-xs text-orange-200">Pour les jeunes</div></div>
                </Link>
              </div>
            </div>
          </div>

          <Link href="/blog" className={`font-medium transition-colors ${isActive('/blog') ? 'text-[#001f5f] font-bold' : 'text-gray-700 hover:text-[#001f5f]'}`}>Blog</Link>
          <Link href="/boutique" className={`font-medium transition-colors ${isActive('/boutique') ? 'text-[#001f5f] font-bold' : 'text-gray-700 hover:text-[#001f5f]'}`}>Boutique</Link>
          <Link href="/a-propos" className={`font-medium transition-colors ${isActive('/a-propos') ? 'text-[#001f5f] font-bold' : 'text-gray-700 hover:text-[#001f5f]'}`}>À propos</Link>
        </nav>
        
        {/* ACTIONS (Panier + Boutons Auth + Menu Mobile) */}
        <div className="flex items-center gap-3 lg:gap-4 pr-4 md:pr-8 flex-shrink-0">
          
          {/* Panier Global */}
          <div className="relative">
            <button onClick={() => setCartOpen(!cartOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-6 h-6 text-[#001f5f]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff5f00] text-white text-xs rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            
            {cartOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border p-4 z-50">
                <h3 className="font-semibold text-gray-900 mb-4">Panier ({cartCount})</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <img src={item.product.image || "/logo.png"} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                          <p className="text-xs text-[#001f5f]">{item.product.price.toLocaleString()} CFA x {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-gray-100 rounded"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-gray-100 rounded"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cart.length > 0 && (
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between font-semibold mb-4">
                      <span>Total</span>
                      <span className="text-[#001f5f]">{cartTotal.toLocaleString()} CFA</span>
                    </div>
                    <button onClick={goToCheckout} className="w-full bg-gradient-to-r from-[#001f5f] to-[#ff5f00] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                      Passer la commande
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <AuthButtons />

          {/* Hamburger Menu Mobile */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-t border-gray-100 py-4 px-4 shadow-lg z-40">
          <nav className="flex flex-col gap-2">
            <Link href="/" className={`px-4 py-3 rounded-lg font-medium ${isActive('/') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link href="/#services" className="px-4 py-3 text-gray-700 hover:bg-orange-50 rounded-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link href="/cours-en-ligne" className={`px-4 py-3 rounded-lg font-medium ${isActive('/cours-en-ligne') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>Cours en Ligne</Link>
            <Link href="/cours-presentiel" className={`px-4 py-3 rounded-lg font-medium ${isActive('/cours-presentiel') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>Cours en Présentiel</Link>
            <Link href="/boutique" className={`px-4 py-3 rounded-lg font-medium ${isActive('/boutique') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>Boutique</Link>
            <Link href="/blog" className={`px-4 py-3 rounded-lg font-medium ${isActive('/blog') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/a-propos" className={`px-4 py-3 rounded-lg font-medium ${isActive('/a-propos') ? 'bg-orange-50 text-[#001f5f]' : 'text-gray-700 hover:bg-orange-50'}`} onClick={() => setMobileMenuOpen(false)}>À propos</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
