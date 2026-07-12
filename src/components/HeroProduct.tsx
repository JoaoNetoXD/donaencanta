import React, { useState } from "react";
import { Star, ShieldCheck, Truck, CreditCard, Eye, CheckCircle2, BadgeCheck, Lock } from "lucide-react";
import { motion } from "motion/react";
import { HERO_PRODUCT } from "../data";
import { Kit } from "../types";
import { brl, parcela, off } from "../utils";

interface Props {
  onBuy: (kit: Kit) => void;
}

export const HeroProduct: React.FC<Props> = ({ onBuy }) => {
  const p = HERO_PRODUCT;
  const [img, setImg] = useState(0);
  const [kit, setKit] = useState<Kit>(p.kits[1] ?? p.kits[0]);

  return (
    <section className="max-w-6xl mx-auto px-4 pt-6 pb-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Galeria */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-brand-pink-100 border border-brand-cream-200">
            <span className="absolute top-4 left-4 z-10 bg-brand-pink-600 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg">
              -{off(p.price, p.originalPrice)}% SÓ HOJE
            </span>
            <span className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur text-brand-charcoal text-[11px] font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-brand-pink-600" /> 23 vendo agora
            </span>
            <img
              src={p.images[img]}
              alt={p.name}
              className="w-full aspect-square object-cover"
              loading="eager"
            />
          </div>
          <div className="mt-3 grid grid-cols-7 gap-2">
            {p.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImg(i)}
                className={`rounded-xl overflow-hidden border-2 transition ${
                  i === img ? "border-brand-pink-600 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="w-full aspect-square object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Oferta */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }}>
          <span className="inline-flex items-center gap-1.5 bg-brand-pink-100 text-brand-pink-800 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full mb-3 tracking-wide">
            <BadgeCheck className="w-4 h-4" /> {p.badge}
          </span>

          <h1 className="text-[32px] sm:text-[40px] font-extrabold leading-[1.12] text-brand-charcoal">
            Chega de passar{" "}
            <span className="font-serif italic text-brand-pink-700">1 hora picando legumes</span>{" "}
            todo santo dia
          </h1>
          <p className="mt-3 text-brand-clay text-base sm:text-lg leading-relaxed">{p.tagline}</p>

          {/* Avaliações */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-extrabold">{p.rating}</span>
            <span className="text-sm text-brand-clay underline decoration-dotted underline-offset-2">
              {p.reviewsCount.toLocaleString("pt-BR")} avaliações verificadas
            </span>
          </div>

          {/* Bullets */}
          <ul className="mt-4 space-y-2.5">
            {p.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm sm:text-[15px]">
                <CheckCircle2 className="w-5 h-5 text-brand-pink-600 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Kits */}
          <p className="mt-6 mb-2 text-xs font-extrabold uppercase tracking-widest text-brand-clay">
            Escolha seu kit:
          </p>
          <div className="space-y-2.5">
            {p.kits.map((k) => (
              <button
                key={k.id}
                onClick={() => setKit(k)}
                className={`w-full text-left rounded-2xl border-2 p-3.5 transition relative ${
                  kit.id === k.id
                    ? "border-brand-pink-600 bg-brand-pink-50 shadow-lg shadow-brand-pink-100"
                    : "border-brand-cream-300 bg-white hover:border-brand-pink-200"
                }`}
              >
                {k.badge && (
                  <span className="absolute -top-2.5 left-4 bg-brand-pink-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow">
                    {k.badge}
                  </span>
                )}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 ${
                        kit.id === k.id ? "border-brand-pink-600" : "border-brand-cream-400"
                      }`}
                    >
                      {kit.id === k.id && <span className="w-2.5 h-2.5 rounded-full bg-brand-pink-600" />}
                    </span>
                    <div>
                      <p className="font-extrabold text-sm sm:text-base">{k.label}</p>
                      {k.sub && <p className="text-xs text-brand-clay">{k.sub}</p>}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-brand-clay line-through">{brl(p.originalPrice * k.qty)}</p>
                    <p className="text-lg font-extrabold text-brand-pink-700">{brl(k.price)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Estoque / urgência */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-brand-pink-700">🔥 83% do lote de hoje já vendido</span>
              <span className="text-brand-clay">restam 17 unid.</span>
            </div>
            <div className="h-2 rounded-full bg-brand-cream-200 overflow-hidden">
              <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-brand-pink-500 to-brand-pink-700" />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5">
            <button
              onClick={() => onBuy(kit)}
              className="cta-shine animate-pulse-slow w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 hover:from-brand-pink-700 hover:to-brand-pink-800 active:scale-[0.99] transition text-white text-lg sm:text-xl font-extrabold py-4 rounded-2xl"
            >
              QUERO O MEU COM {off(p.price, p.originalPrice)}% OFF →
            </button>
            <p className="mt-2.5 text-center text-sm text-brand-clay">
              <span className="font-extrabold text-brand-charcoal">{brl(kit.price)}</span> no Pix{" "}
              <span className="text-brand-clay">ou 3x de {parcela(kit.price)} sem juros</span>
            </p>
          </div>

          {/* Selos */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-brand-clay">
            <div className="flex flex-col items-center gap-1 bg-white rounded-xl p-2.5 border border-brand-cream-200">
              <Truck className="w-4 h-4 text-brand-pink-600" />
              <span className="font-bold">Frete Grátis Brasil</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-white rounded-xl p-2.5 border border-brand-cream-200">
              <ShieldCheck className="w-4 h-4 text-brand-pink-600" />
              <span className="font-bold">7 dias de garantia</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-white rounded-xl p-2.5 border border-brand-cream-200">
              <CreditCard className="w-4 h-4 text-brand-pink-600" />
              <span className="font-bold">Pix ou Cartão</span>
            </div>
          </div>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-brand-clay">
            <Lock className="w-3.5 h-3.5 text-brand-pink-600" />
            Compra 100% protegida — seus dados nunca são compartilhados
          </p>
        </motion.div>
      </div>
    </section>
  );
};
