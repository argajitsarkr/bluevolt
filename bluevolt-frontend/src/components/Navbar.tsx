"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { count } = useCart();
  const isAdmin = !!(session?.user as any)?.isAdmin;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bluevolt-logo.png" alt="Blue Volt Scientific" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm text-ink/80">
          <Link href="/products" className="hover:text-brand">Products</Link>
          <Link href="/services" className="hover:text-brand">Services</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3 text-sm">
          <Link href="/cart" className="relative px-3 py-1.5 rounded-lg border border-ink/15 hover:bg-ink/5">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand text-white text-xs rounded-full px-1.5 min-w-[18px] text-center">
                {count}
              </span>
            )}
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-brand">Dashboard</Link>
              {isAdmin && <Link href="/admin" className="text-brand font-medium">Admin</Link>}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="text-ink/70 hover:text-ink">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="hover:text-brand">Sign in</Link>
              <Link href="/auth/signup" className="btn-primary text-sm py-1.5 px-3">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
