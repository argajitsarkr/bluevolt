"use client";
import { useState } from "react";
import { useCart } from "./CartContext";

export default function CustomQueryForm() {
  const { addCustom } = useCart();
  const [text, setText] = useState("");
  const [qty, setQty] = useState(1);
  return (
    <div className="card p-4">
      <div className="font-medium mb-2">Can't find what you need? Add a custom request</div>
      <textarea
        className="input min-h-[80px]"
        placeholder="e.g. 5kg sodium acetate, ACS grade. Or 'Need quote to service Eppendorf 5430R, low spin error.'"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-3 mt-2">
        <label className="text-sm text-ink/70">Qty</label>
        <input
          type="number"
          min={1}
          className="input w-20"
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
        />
        <button
          className="btn-primary ml-auto text-sm"
          onClick={() => {
            if (!text.trim()) return;
            addCustom(text.trim(), qty);
            setText("");
            setQty(1);
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
