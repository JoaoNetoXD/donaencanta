import React, { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { RECENT_BUYERS } from "../data";

/** Aviso discreto de compra recente — prova social rotativa */
export const SocialToast: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    const cycle = (i: number) => {
      if (!alive) return;
      setIdx(i % RECENT_BUYERS.length);
      setVisible(true);
      setTimeout(() => alive && setVisible(false), 5000);
      setTimeout(() => alive && cycle(i + 1), 13000);
    };
    const start = setTimeout(() => cycle(0), 7000);
    return () => {
      alive = false;
      clearTimeout(start);
    };
  }, []);

  if (!visible) return null;
  const b = RECENT_BUYERS[idx];

  return (
    <div className="animate-toast-in fixed bottom-20 sm:bottom-5 left-4 z-40 max-w-[280px] bg-white rounded-2xl shadow-2xl border border-brand-cream-200 p-3 flex items-start gap-2.5">
      <span className="w-9 h-9 rounded-full bg-brand-pink-100 text-brand-pink-800 grid place-items-center text-xs font-extrabold shrink-0">
        {b.name[0]}
      </span>
      <div className="text-xs leading-snug">
        <p>
          <b>{b.name}</b> de {b.city} comprou <b>{b.product}</b>
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-green-700 font-bold">
          <BadgeCheck className="w-3 h-3" /> Compra verificada • {b.ago}
        </p>
      </div>
    </div>
  );
};
