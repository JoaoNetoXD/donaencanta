export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const parcela = (v: number, n = 3) => brl(v / n);

export const off = (price: number, original: number) =>
  Math.round((1 - price / original) * 100);
