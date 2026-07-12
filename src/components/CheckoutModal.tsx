import React, { useState } from "react";
import { X, Lock, ShieldCheck, Truck, Plus, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ALL_PRODUCTS } from "../data";
import { Kit, Product } from "../types";
import { brl, parcela, off } from "../utils";

// O checkout da serverflow só funciona no domínio dele (mesma-origem: X-Frame-Options
// + Cloudflare + Turbopack impedem embutir). Então abrimos numa nova aba, na URL
// absoluta dele, onde renderiza e paga normalmente.
const CHECKOUT_BASE = "https://serverflow.dad";

export interface CheckoutState {
  product: Product;
  kit: Kit;
}

interface Props {
  checkout: CheckoutState;
  onClose: () => void;
}

/** Mini-cards de cross-sell: outros produtos para a cliente aproveitar */
const CrossSell: React.FC<{
  current: Product;
  onPick: (p: Product) => void;
}> = ({ current, onPick }) => {
  const others = ALL_PRODUCTS.filter((p) => p.id !== current.id).slice(0, 3);
  return (
    <div className="mt-5 pt-4 border-t border-brand-cream-200">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-pink-700 mb-2">
        💗 Clientes também levaram
      </p>
      <div className="space-y-2">
        {others.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className="w-full flex items-center gap-2.5 bg-white rounded-xl border border-brand-cream-200 hover:border-brand-pink-400 hover:shadow-md transition p-2 text-left"
          >
            <img src={p.images[0]} alt="" className="w-11 h-11 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold truncate">{p.shortName}</p>
              <p className="text-[11px]">
                <span className="line-through text-brand-clay">{brl(p.originalPrice)}</span>{" "}
                <span className="font-extrabold text-brand-pink-700">{brl(p.price)}</span>{" "}
                <span className="text-green-700 font-bold">-{off(p.price, p.originalPrice)}%</span>
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1 bg-brand-pink-100 text-brand-pink-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded-full">
              <Plus className="w-3 h-3" /> VER
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const CheckoutModal: React.FC<Props> = ({ checkout, onClose }) => {
  const [current, setCurrent] = useState<CheckoutState>(checkout);
  const { product, kit } = current;
  const [step, setStep] = useState<"form" | "opened">("form");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");

  const valid = nome.trim().length >= 3 && telefone.replace(/\D/g, "").length >= 10;
  const payPath = kit.checkoutUrl || product.checkoutUrl;
  const payUrl = payPath ? CHECKOUT_BASE + payPath : "";

  const switchTo = (p: Product) => {
    setCurrent({ product: p, kit: p.kits[0] });
    setStep("form");
  };

  const openCheckout = () => {
    if (!payUrl) return;
    // Salva o lead antes de mandar pro pagamento
    try {
      const leads = JSON.parse(localStorage.getItem("leads") ?? "[]");
      leads.push({
        nome,
        telefone,
        cep,
        endereco,
        produto: product.shortName,
        kit: kit.label,
        valor: kit.price,
        data: new Date().toISOString(),
      });
      localStorage.setItem("leads", JSON.stringify(leads));
    } catch {
      /* localStorage indisponível — segue mesmo assim */
    }
    // Abre o checkout em nova aba (gesto do clique preserva o popup)
    window.open(payUrl, "_blank", "noopener");
    setStep("opened");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[94vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-cream-200 px-4 py-3 flex items-center justify-between z-10">
          <p className="font-extrabold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-pink-600" /> Checkout Seguro
          </p>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-full hover:bg-brand-cream-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "form" && payUrl ? (
          <div className="p-4">
            {/* Resumo + troca de kit */}
            <div className="flex items-center gap-3 bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-3">
              <img src={product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-extrabold text-sm leading-snug">{product.shortName}</p>
                <div className="mt-0.5 flex flex-wrap gap-1">
                  {product.kits.map((k) => (
                    <button
                      key={k.id}
                      onClick={() => setCurrent({ product, kit: k })}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border transition ${
                        kit.id === k.id
                          ? "bg-brand-pink-600 border-brand-pink-600 text-white"
                          : "border-brand-cream-300 text-brand-clay hover:border-brand-pink-400"
                      }`}
                    >
                      {k.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm mt-1">
                  <span className="line-through text-brand-clay text-xs">{brl(product.originalPrice * kit.qty)}</span>{" "}
                  <span className="font-extrabold text-brand-pink-700">{brl(kit.price)}</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-green-700 font-extrabold flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Frete GRÁTIS incluído
            </p>

            {/* Dados */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-extrabold text-brand-charcoal">Seu nome *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Maria da Silva"
                  className="mt-1 w-full rounded-xl border-2 border-brand-cream-300 focus:border-brand-pink-600 outline-none px-3 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-extrabold text-brand-charcoal">Telefone (com DDD) *</label>
                <input
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  inputMode="tel"
                  className="mt-1 w-full rounded-xl border-2 border-brand-cream-300 focus:border-brand-pink-600 outline-none px-3 py-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-extrabold text-brand-charcoal">CEP</label>
                  <input
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                    className="mt-1 w-full rounded-xl border-2 border-brand-cream-300 focus:border-brand-pink-600 outline-none px-3 py-3 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-extrabold text-brand-charcoal">Endereço e número</label>
                  <input
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua das Flores, 123"
                    className="mt-1 w-full rounded-xl border-2 border-brand-cream-300 focus:border-brand-pink-600 outline-none px-3 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={!valid}
              onClick={openCheckout}
              className="mt-4 w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 hover:from-brand-pink-700 hover:to-brand-pink-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-extrabold py-4 rounded-2xl text-base shadow-lg shadow-brand-pink-200 flex items-center justify-center gap-2"
            >
              PAGAR AGORA — {brl(kit.price)} <ExternalLink className="w-4 h-4" />
            </button>
            <p className="mt-2 text-center text-[11px] text-brand-clay">
              Pix na hora ou 3x de {parcela(kit.price)} sem juros
            </p>

            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-brand-clay">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Ambiente seguro</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 7 dias de garantia</span>
            </div>

            <CrossSell current={product} onPick={switchTo} />
          </div>
        ) : step === "opened" ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 grid place-items-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mt-3 font-extrabold text-lg">Pagamento aberto em nova aba 🔒</h3>
            <p className="mt-1 text-sm text-brand-clay">
              Abrimos o pagamento seguro numa aba nova. Finalize seu Pix ou cartão por lá — seu
              pedido de <b>{product.shortName}</b> ({kit.label}) fica reservado por 15 minutos.
            </p>

            <a
              href={payUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-brand-pink-200"
            >
              <ExternalLink className="w-4 h-4" /> Não abriu? Clique para pagar
            </a>
            <p className="mt-2 text-[11px] text-brand-clay">
              {brl(kit.price)} • frete grátis • garantia de 7 dias
            </p>

            <CrossSell current={product} onPick={switchTo} />
          </div>
        ) : (
          // Produto sem link de checkout (fallback)
          <div className="p-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-brand-pink-100 grid place-items-center">
              <Loader2 className="w-7 h-7 text-brand-pink-600" />
            </div>
            <h3 className="mt-3 font-extrabold text-lg">Pagamento em breve 💗</h3>
            <p className="mt-1 text-sm text-brand-clay">
              Este produto está com o checkout em finalização. Volte já já — ou aproveite as outras
              ofertas da loja!
            </p>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 text-white font-extrabold py-3 rounded-2xl"
            >
              Ver outras ofertas
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
