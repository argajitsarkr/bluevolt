"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { CartLine, Product, Service } from "@/types";

type CartCtx = {
  lines: CartLine[];
  count: number;
  addProduct: (p: Product, qty?: number) => void;
  addService: (s: Service, qty?: number) => void;
  addCustom: (text: string, qty?: number) => void;
  setQuantity: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "bluevolt_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addProduct = useCallback((p: Product, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.kind === "product" && l.product.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        const cur = copy[idx] as Extract<CartLine, { kind: "product" }>;
        copy[idx] = { ...cur, quantity: cur.quantity + qty };
        return copy;
      }
      return [...prev, { kind: "product", product: p, quantity: qty }];
    });
  }, []);

  const addService = useCallback((s: Service, qty = 1) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.kind === "service" && l.service.id === s.id);
      if (idx >= 0) {
        const copy = [...prev];
        const cur = copy[idx] as Extract<CartLine, { kind: "service" }>;
        copy[idx] = { ...cur, quantity: cur.quantity + qty };
        return copy;
      }
      return [...prev, { kind: "service", service: s, quantity: qty }];
    });
  }, []);

  const addCustom = useCallback((text: string, qty = 1) => {
    setLines((prev) => [
      ...prev,
      { kind: "custom", text, quantity: qty, tempId: crypto.randomUUID() },
    ]);
  }, []);

  const setQuantity = useCallback((index: number, qty: number) => {
    setLines((prev) => {
      const copy = [...prev];
      const cur = copy[index];
      if (!cur) return prev;
      copy[index] = { ...cur, quantity: Math.max(1, qty) } as CartLine;
      return copy;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <Ctx.Provider value={{ lines, count, addProduct, addService, addCustom, setQuantity, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside CartProvider");
  return v;
}
