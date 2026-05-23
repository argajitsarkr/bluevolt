import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bluevolt-logo.png" alt="Blue Volt Scientific" className="h-10 w-auto bg-white p-1.5" />
          <p className="mt-4 text-white/60 text-sm max-w-sm">
            A scientific supply + servicing desk. We catalog the everyday, we call to confirm every order, and we never ask for payment online.
          </p>
        </div>
        <div>
          <div className="eyebrow-light mb-4">Catalog</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/products" className="hover:text-white">Products</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow-light mb-4">Account</div>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/auth/signup" className="hover:text-white">Create account</Link></li>
            <li><Link href="/auth/signin" className="hover:text-white">Sign in</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Your orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="rule-light">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
          <div className="mono uppercase tracking-[0.18em]">© {new Date().getFullYear()} Blue Volt Scientific</div>
          <div className="mono uppercase tracking-[0.18em]">No online payments - we call to confirm</div>
        </div>
      </div>
    </footer>
  );
}
