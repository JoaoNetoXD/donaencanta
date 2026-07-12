import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Heart, Star, Lock } from "lucide-react";
import { TopBar } from "./components/TopBar";
import { HeroProduct } from "./components/HeroProduct";
import { ProductsSection } from "./components/ProductsSection";
import { Reviews } from "./components/Reviews";
import { Guarantees, Faq, HowItWorks } from "./components/Faq";
import { SocialToast } from "./components/SocialToast";
import { CheckoutModal, CheckoutState } from "./components/CheckoutModal";
import { CONFIG, HERO_PRODUCT } from "./data";
import { Kit, Product } from "./types";
import { brl } from "./utils";

export default function App() {
  const [checkout, setCheckout] = useState<CheckoutState | null>(null);

  const buyHero = (kit: Kit) => setCheckout({ product: HERO_PRODUCT, kit });
  const buy = (product: Product, kit: Kit) => setCheckout({ product, kit });

  return (
    <div className="min-h-screen bg-brand-cream-50 text-brand-charcoal selection:bg-brand-pink-600 selection:text-white">
      <TopBar />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur border-b border-brand-cream-200">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink-500 to-brand-pink-700 grid place-items-center shadow-md shadow-brand-pink-200">
              <Heart className="w-4 h-4 text-white fill-current" />
            </span>
            <span className="leading-none">
              <span className="font-serif text-2xl font-bold text-brand-charcoal block">
                {CONFIG.LOJA}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-brand-pink-700 font-bold">
                {CONFIG.SLOGAN}
              </span>
            </span>
          </p>
          <div className="flex flex-col items-end gap-0.5">
            <div className="flex items-center gap-1 text-xs text-brand-clay">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-extrabold text-brand-charcoal">4.9</span>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-brand-clay font-bold">
              <Lock className="w-3 h-3 text-green-700" /> Loja 100% segura • +9.600 clientes
            </span>
          </div>
        </div>
      </header>

      <main>
        <HeroProduct onBuy={buyHero} />
        <Reviews />
        <HowItWorks />
        <ProductsSection onBuy={buy} />
        <Guarantees />
        <Faq />
      </main>

      <footer className="bg-brand-charcoal text-brand-cream-300 text-center text-xs py-8 px-4">
        <p className="font-serif text-xl text-white">{CONFIG.LOJA}</p>
        <p className="mt-0.5 text-[10px] tracking-[0.2em] uppercase text-brand-pink-500 font-bold">
          {CONFIG.SLOGAN}
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px]">
          <a href="#" className="hover:text-white underline-offset-2 hover:underline">Termos de Uso</a>
          <a href="#" className="hover:text-white underline-offset-2 hover:underline">Privacidade</a>
          <a href="#" className="hover:text-white underline-offset-2 hover:underline">Trocas e Devoluções</a>
        </div>
        <p className="mt-4">Pagamentos processados em ambiente seguro • Pix e cartões aceitos</p>
        <p className="mt-1 opacity-60">© 2026 {CONFIG.LOJA}. Todos os direitos reservados.</p>
      </footer>

      {/* CTA fixo no mobile */}
      {!checkout && (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur border-t border-brand-cream-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
          <button
            onClick={() => buyHero(HERO_PRODUCT.kits[1] ?? HERO_PRODUCT.kits[0])}
            className="cta-shine w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg shadow-brand-pink-200"
          >
            QUERO O CORTADOR POR {brl(HERO_PRODUCT.price)} →
          </button>
        </div>
      )}
      {/* espaço para o CTA fixo não cobrir o footer no mobile */}
      <div className="h-20 sm:hidden" />

      <SocialToast />

      <AnimatePresence>
        {checkout && <CheckoutModal checkout={checkout} onClose={() => setCheckout(null)} />}
      </AnimatePresence>
    </div>
  );
}
