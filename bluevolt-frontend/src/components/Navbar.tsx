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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bluevolt-logo.png" alt="Blue Volt Scientific" className="h-10 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-7 mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
          <Link href="/products" className="hover:text-ink">Products</Link>
          <Link href="/services" className="hover:text-ink">Services</Link>
        </nav>
        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link
            href="/cart"
            className="mono relative text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-ink"
          >
            Cart{count > 0 && <span className="ml-1 text-brand">[{count}]</span>}
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="mono text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-ink">
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="mono text-[11px] uppercase tracking-[0.18em] text-brand">
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ink"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="mono text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-ink">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary py-2 px-4 text-xs">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
