export type User = {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
};

export type Category = { id: number; name: string; slug: string; kind: "product" | "service" };

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category_id: number | null;
  brand: string;
  sku: string;
  pack_size: string;
  mrp_paise: number;
  our_price_paise: number;
  in_stock: boolean;
  image_url: string;
  created_at: string;
};

export type Service = {
  id: number;
  slug: string;
  name: string;
  description: string;
  category_id: number | null;
  indicative_price_paise: number | null;
  turnaround_days: number | null;
  image_url: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  kind: "product" | "service" | "custom";
  product_id: number | null;
  service_id: number | null;
  custom_text: string;
  name_snapshot: string;
  quantity: number;
  unit_price_paise: number | null;
};

export type Order = {
  id: number;
  user_id: number;
  status: "pending" | "confirmed" | "cancelled" | "fulfilled";
  contact_name: string;
  contact_phone: string;
  notes: string;
  created_at: string;
  items: OrderItem[];
  user_email?: string;
};

export type CartLine =
  | { kind: "product"; product: Product; quantity: number }
  | { kind: "service"; service: Service; quantity: number }
  | { kind: "custom"; text: string; quantity: number; tempId: string };
