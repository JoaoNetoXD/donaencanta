import React, { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { PRODUCTS } from "../data";
import { Kit, Product } from "../types";
import { brl, parcela, off } from "../utils";

interface Props {
  onBuy: (product: Product, kit: Kit) => void;
}

const Card: React.FC<{ p: Product; i: number; onBuy: Props["onBuy"] }> = ({ p, i, onBuy }) => {
  const [img, setImg] = useState(0);
  const [kit, setKit] = useState<Kit>(p.kits[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.06 }}
      className="bg-white rounded-3xl border border-brand-cream-200 shadow-md hover:shadow-2xl hover:shadow-brand-pink-100 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative">
        <span className="absolute top-3 left-3 z-10 bg-brand-pink-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow">
          -{off(p.price, p.originalPrice)}%
        </span>
        <img
          src={p.images[img]}
          alt={p.name}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        {p.images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {p.images.map((_, j) => (
              <button
                key={j}
                onMouseEnter={() => setImg(j)}
                onClick={() => setImg(j)}
                className={`w-2 h-2 rounded-full ${j === img ? "bg-brand-pink-600" : "bg-white/85 border border-brand-cream-300"}`}
                aria-label={`foto ${j + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-extrabold text-brand-pink-700 tracking-widest">{p.badge}</span>
        <h3 className="font-extrabold text-brand-charcoal leading-snug mt-1">{p.shortName}</h3>
        <p className="text-xs text-brand-clay mt-1">{p.tagline}</p>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, j) => (
              <Star key={j} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-[11px] font-extrabold">{p.rating}</span>
          <span className="text-[11px] text-brand-clay">({p.reviewsCount.toLocaleString("pt-BR")})</span>
        </div>

        <ul className="mt-2 space-y-1">
          {p.bullets.slice(0, 3).map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-[11px] text-brand-clay">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-pink-500 shrink-0 mt-px" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Kits compactos */}
        <div className="mt-3 flex gap-1.5">
          {p.kits.map((k) => (
            <button
              key={k.id}
              onClick={() => setKit(k)}
              className={`flex-1 rounded-xl border-2 px-1.5 py-1.5 text-[11px] font-bold transition ${
                kit.id === k.id
                  ? "border-brand-pink-600 bg-brand-pink-50 text-brand-pink-800"
                  : "border-brand-cream-300 text-brand-clay hover:border-brand-pink-200"
              }`}
            >
              {k.label}
              <span className="block font-extrabold">{brl(k.price)}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3">
          <p className="text-xs text-brand-clay">
            <span className="line-through">{brl(p.originalPrice * kit.qty)}</span>{" "}
            <span className="text-brand-pink-700 font-extrabold text-lg">{brl(kit.price)}</span>
            <span className="block">ou 3x de {parcela(kit.price)} sem juros</span>
          </p>
          <button
            onClick={() => onBuy(p, kit)}
            className="mt-2 w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 hover:from-brand-pink-700 hover:to-brand-pink-800 active:scale-[0.98] transition text-white font-extrabold py-3 rounded-xl text-sm shadow-md shadow-brand-pink-200"
          >
            COMPRAR AGORA →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductsSection: React.FC<Props> = ({ onBuy }) => (
  <section id="produtos" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-24">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-brand-charcoal">
      As outras <span className="font-serif italic text-brand-pink-700">paixões</span> das nossas clientes
    </h2>
    <p className="text-center text-brand-clay mt-2 text-sm sm:text-base">
      Estoque limitado — promoção válida só enquanto durar o lote de hoje.
    </p>
    <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PRODUCTS.map((p, i) => (
        <Card key={p.id} p={p} i={i} onBuy={onBuy} />
      ))}
    </div>
  </section>
);
