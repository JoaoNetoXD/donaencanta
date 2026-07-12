import React from "react";
import { Star, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { REVIEWS } from "../data";

const AVATAR_COLORS = [
  "bg-brand-pink-100 text-brand-pink-800",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-800",
  "bg-sky-100 text-sky-800",
  "bg-violet-100 text-violet-800",
  "bg-rose-100 text-rose-800",
];

export const Reviews: React.FC = () => (
  <section id="avaliacoes" className="bg-white border-y border-brand-cream-200 py-12 scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-brand-charcoal">
        Mais de <span className="font-serif italic text-brand-pink-700">9.600 mulheres</span> já se apaixonaram
      </h2>
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
        </div>
        <span className="font-extrabold">4.9/5</span>
        <span className="text-sm text-brand-clay">— avaliações de compras verificadas</span>
      </div>

      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-5 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className="flex text-amber-400">
                {[...Array(r.rating)].map((_, j) => (
                  <Star key={j} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[10px] text-brand-clay">{r.date}</span>
            </div>
            <p className="mt-3 text-sm text-brand-charcoal leading-relaxed flex-1">“{r.comment}”</p>
            <div className="mt-4 flex items-center gap-2.5">
              <span
                className={`w-9 h-9 rounded-full grid place-items-center text-xs font-extrabold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
              >
                {r.userName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </span>
              <div>
                <p className="text-xs font-extrabold leading-tight">
                  {r.userName} <span className="font-normal text-brand-clay">• {r.city}</span>
                </p>
                <p className="flex items-center gap-1 text-[10px] text-green-700 font-bold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Compra verificada — {r.productName}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
