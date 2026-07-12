import React, { useEffect, useState } from "react";
import { Flame } from "lucide-react";

function useCountdown() {
  const target = React.useMemo(() => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t.getTime();
  }, []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { h: pad(h), m: pad(m), s: pad(s) };
}

const Cell: React.FC<{ v: string; l: string }> = ({ v, l }) => (
  <span className="flex flex-col items-center leading-none">
    <span className="bg-white/20 rounded-md px-1.5 py-1 font-mono font-bold tabular-nums text-sm">{v}</span>
    <span className="text-[8px] mt-0.5 opacity-80 uppercase">{l}</span>
  </span>
);

export const TopBar: React.FC = () => {
  const t = useCountdown();
  return (
    <div className="sticky top-0 z-40 w-full bg-gradient-to-r from-brand-pink-800 via-brand-pink-600 to-brand-pink-800 text-white py-2 px-3 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        <p className="text-xs sm:text-sm font-extrabold tracking-wide flex items-center gap-1.5">
          <Flame className="w-4 h-4 shrink-0" />
          OFERTA DO DIA: até 50% OFF + FRETE GRÁTIS
        </p>
        <div className="flex items-center gap-1">
          <Cell v={t.h} l="hrs" />
          <span className="font-bold pb-3">:</span>
          <Cell v={t.m} l="min" />
          <span className="font-bold pb-3">:</span>
          <Cell v={t.s} l="seg" />
        </div>
      </div>
    </div>
  );
};
