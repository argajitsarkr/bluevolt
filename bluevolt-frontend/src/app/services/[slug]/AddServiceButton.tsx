"use client";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import type { Service } from "@/types";

export default function AddServiceButton({ service }: { service: Service }) {
  const { addService } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        addService(service, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }}
      className="btn-primary"
    >
      {added ? "Added to cart" : "Request this service"}
    </button>
  );
}
