import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Truck, RotateCcw, Lock, Heart } from "lucide-react";
import { motion } from "motion/react";
import { FAQ, STEPS } from "../data";

/** Como funciona — 3 passos simples */
export const HowItWorks: React.FC = () => (
  <section className="max-w-5xl mx-auto px-4 py-12">
    <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-brand-charcoal">
      Comprar é <span className="font-serif italic text-brand-pink-700">simples assim</span>
    </h2>
    <div className="mt-8 grid sm:grid-cols-3 gap-4">
      {STEPS.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="relative bg-white rounded-2xl border border-brand-cream-200 p-6 text-center shadow-sm"
        >
          <span className="mx-auto w-11 h-11 rounded-full bg-gradient-to-br from-brand-pink-500 to-brand-pink-700 text-white font-serif text-xl font-bold grid place-items-center shadow-lg shadow-brand-pink-200">
            {s.n}
          </span>
          <h3 className="mt-3 font-extrabold text-brand-charcoal">{s.t}</h3>
          <p className="mt-1.5 text-sm text-brand-clay leading-relaxed">{s.s}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

/** Selos de garantia + faixa de confiança */
export const Guarantees: React.FC = () => (
  <section className="max-w-6xl mx-auto px-4 py-6">
    <div className="rounded-3xl bg-gradient-to-r from-brand-pink-700 via-brand-pink-600 to-brand-pink-700 text-white p-6 sm:p-8 shadow-xl shadow-brand-pink-100">
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
        <div className="shrink-0 w-20 h-20 rounded-full bg-white/15 border-2 border-white/40 grid place-items-center">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-2xl font-extrabold">Garantia Encantada de 7 dias</h3>
          <p className="mt-1 text-sm text-white/90 leading-relaxed max-w-xl">
            Recebeu e não se apaixonou? Devolvemos <b>100% do seu dinheiro</b>, sem perguntas e sem
            burocracia. O risco é todo nosso — você só tem a ganhar.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-[11px]">
        {[
          { icon: Truck, t: "Frete Grátis", s: "para todo o Brasil" },
          { icon: RotateCcw, t: "Troca Fácil", s: "7 dias sem burocracia" },
          { icon: Lock, t: "Site Seguro", s: "criptografia SSL" },
          { icon: Heart, t: "Suporte Dedicado", s: "atendimento todos os dias" },
        ].map(({ icon: Icon, t, s }) => (
          <div key={t} className="bg-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
            <Icon className="w-5 h-5" />
            <p className="font-extrabold">{t}</p>
            <p className="opacity-80">{s}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-extrabold text-center text-brand-charcoal mb-6">
        Dúvidas <span className="font-serif italic text-brand-pink-700">rápidas</span>
      </h2>
      <div className="space-y-2.5">
        {FAQ.map((f, i) => (
          <div key={f.q} className="bg-white rounded-2xl border border-brand-cream-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left font-extrabold text-sm sm:text-base"
            >
              {f.q}
              <ChevronDown
                className={`w-5 h-5 shrink-0 text-brand-pink-600 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && <p className="px-4 pb-4 text-sm text-brand-clay leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};
