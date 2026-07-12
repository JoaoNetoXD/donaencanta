import React, { useState } from "react";
import { X, Lock, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Kit, Product } from "../types";
import { brl, parcela } from "../utils";

export interface CheckoutState {
  product: Product;
  kit: Kit;
}

interface Props {
  checkout: CheckoutState;
  onClose: () => void;
}

export const CheckoutModal: React.FC<Props> = ({ checkout, onClose }) => {
  const { product, kit } = checkout;
  const [step, setStep] = useState<"form" | "pay">("form");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [loadingPay, setLoadingPay] = useState(true);

  const valid = nome.trim().length >= 3 && telefone.replace(/\D/g, "").length >= 10;

  // Cada kit tem seu link de checkout; sem link ainda → usa o do produto
  const payUrl = kit.checkoutUrl || product.checkoutUrl;

  /**
   * Corta a área visível do checkout: esconde o cabeçalho/card de produto
   * ("VOCÊ ESTÁ ADQUIRINDO") e o rodapé jurídico, deixando só a seção de
   * pagamento + total + botão. Possível porque o checkout é servido pelo
   * nosso domínio (proxy) — iframe same-origin permite mexer no DOM interno.
   */
  const cropCheckout = (iframe: HTMLIFrameElement) => {
    try {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const hide = () => {
        // Re-consulta o DOM a cada passagem: o checkout é React e re-renderiza,
        // trocando os nós — refs guardadas viram nó morto e os ajustes somem.

        // 1) Cabeçalho "VOCÊ ESTÁ ADQUIRINDO" (card do produto)
        const leaf = Array.from(doc.querySelectorAll("p, h1, h2, h3, span, div")).find(
          (el) => el.children.length === 0 && /VOCÊ ESTÁ ADQUIRINDO/i.test(el.textContent || "")
        );
        const card = leaf?.closest<HTMLElement>(".rounded-2xl");
        if (card && card.style.display !== "none") {
          card.style.display = "none";
          const container = card.parentElement;
          if (container) container.style.paddingTop = "12px";
          doc.documentElement.scrollTop = 0;
        }

        // 2) Rodapé jurídico ("...intermediadora do pagamento" + "Denunciar conteúdo")
        const disc = Array.from(doc.querySelectorAll("p")).find((el) =>
          /intermediadora do pagamento/i.test(el.textContent || "")
        );
        const footer =
          disc?.closest<HTMLElement>(".border-t") ?? disc?.parentElement ?? null;
        if (footer) footer.style.display = "none";

        // 3) Zera as folgas do checkout (min-h-screen força altura de tela cheia,
        //    pb-32 = 128px de espaço morto no fim)
        doc.querySelectorAll<HTMLElement>(".min-h-screen").forEach((el) =>
          el.style.setProperty("min-height", "0", "important")
        );
        doc.querySelectorAll<HTMLElement>('[class*="pb-32"]').forEach((el) =>
          el.style.setProperty("padding-bottom", "16px", "important")
        );

        // 4) Corta o iframe na base do último elemento visível de verdade
        //    (imune a qualquer folga/rodapé remanescente)
        const bodyTop = doc.body.getBoundingClientRect().top;
        let bottom = 0;
        doc.querySelectorAll<HTMLElement>(".min-h-screen *").forEach((el) => {
          if (footer && footer.contains(el)) return;
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.width > 0) bottom = Math.max(bottom, r.bottom - bodyTop);
        });
        const h = Math.ceil(bottom) + 16;
        if (h > 32) iframe.style.height = h + "px";
      };
      hide();
      // Checkout é um app React: re-renderiza e recriaria o card — re-esconde sempre
      const observer = new MutationObserver(hide);
      observer.observe(doc.body, { childList: true, subtree: true });
      // Re-medições temporizadas: garantem que a altura converge após o layout
      // assentar (o observer sozinho pode medir antes do reflow terminar).
      [80, 200, 450, 900, 1600].forEach((ms) => setTimeout(hide, ms));
    } catch {
      /* se algo mudar no checkout, mostra a página inteira em vez de quebrar */
    }
  };

  const goToPay = () => {
    // Guarda o lead localmente (nome, contato, endereço + item escolhido)
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
      /* localStorage indisponível — segue para o pagamento mesmo assim */
    }
    setStep("pay");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className={`relative w-full bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[94vh] overflow-y-auto ${
          step === "pay" ? "sm:max-w-lg" : "sm:max-w-md"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-cream-200 px-4 py-3 flex items-center justify-between z-10">
          <p className="font-extrabold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-pink-600" />
            {step === "form" ? "Checkout Seguro" : "Pagamento Seguro"}
          </p>
          <button onClick={onClose} aria-label="Fechar" className="p-1 rounded-full hover:bg-brand-cream-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "form" ? (
          <div className="p-4">
            {/* Resumo */}
            <div className="flex items-center gap-3 bg-brand-cream-50 rounded-2xl border border-brand-cream-200 p-3">
              <img src={product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-extrabold text-sm leading-snug">{product.shortName}</p>
                <p className="text-xs text-brand-clay">{kit.label}</p>
                <p className="text-sm">
                  <span className="line-through text-brand-clay text-xs">{brl(product.originalPrice * kit.qty)}</span>{" "}
                  <span className="font-extrabold text-brand-pink-700">{brl(kit.price)}</span>
                </p>
              </div>
            </div>
            <p className="mt-2 text-xs text-center text-green-700 font-extrabold flex items-center justify-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Frete GRÁTIS incluído
            </p>

            {/* Só o essencial */}
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
              onClick={goToPay}
              className="mt-4 w-full bg-gradient-to-r from-brand-pink-600 to-brand-pink-700 hover:from-brand-pink-700 hover:to-brand-pink-800 disabled:opacity-40 disabled:cursor-not-allowed transition text-white font-extrabold py-4 rounded-2xl text-base shadow-lg shadow-brand-pink-200"
            >
              IR PARA O PAGAMENTO — {brl(kit.price)}
            </button>
            <p className="mt-2 text-center text-[11px] text-brand-clay">
              ou 3x de {parcela(kit.price)} sem juros no cartão
            </p>

            <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-brand-clay">
              <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Dados protegidos</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 7 dias de garantia</span>
            </div>
          </div>
        ) : !payUrl ? (
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
        ) : (
          <div className="relative">
            {loadingPay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white z-10">
                <Loader2 className="w-8 h-8 text-brand-pink-600 animate-spin" />
                <p className="text-sm font-extrabold text-brand-clay">Carregando pagamento seguro...</p>
              </div>
            )}
            <iframe
              src={payUrl}
              title="Pagamento"
              onLoad={(e) => {
                cropCheckout(e.currentTarget);
                setLoadingPay(false);
              }}
              className="w-full h-[70vh] border-0"
              allow="payment"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
