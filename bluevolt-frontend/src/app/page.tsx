import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 to-white border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand mb-3">Lab supplies, simplified</div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Chemicals, glassware, equipment.<br />
              <span className="text-brand">Discounted</span> - and we call you to confirm.
            </h1>
            <p className="mt-5 text-ink/70 text-lg max-w-xl">
              Blue Volt Scientific catalogs everyday lab essentials and on-demand instrument servicing.
              Browse, add to cart, submit your phone number. No payments online - a human confirms every order.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/products" className="btn-primary">Browse products</Link>
              <Link href="/services" className="btn-outline">See services</Link>
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-mono uppercase text-ink/60 mb-3">How it works</div>
            <ol className="space-y-3 text-sm">
              <li><b className="text-brand">1.</b> Browse the catalog or submit a custom query for anything off-catalog.</li>
              <li><b className="text-brand">2.</b> Add to cart, sign in with email + phone.</li>
              <li><b className="text-brand">3.</b> We call you back, confirm stock + pricing, then dispatch.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-6">What we supply</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Chemicals & Reagents", d: "Solvents, acids, salts, biochem reagents." },
            { t: "Glassware & Plasticware", d: "Beakers, flasks, pipettes, tubes." },
            { t: "Lab Equipment", d: "Centrifuges, pH meters, balances, hotplates." },
            { t: "Consumables", d: "Gloves, tips, filter paper, parafilm." },
          ].map((c) => (
            <div key={c.t} className="card p-5">
              <div className="font-medium">{c.t}</div>
              <p className="text-sm text-ink/70 mt-1">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-brand-100 mb-3">Services</div>
            <h2 className="text-3xl font-bold">Instrument repair + servicing</h2>
            <p className="mt-3 text-white/70">
              Repairs, AMC, calibration, and bespoke servicing. Submit your instrument details - we send a quote.
            </p>
            <Link href="/services" className="btn-primary mt-5">Request a service</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["Instrument repair", "Annual maintenance", "Calibration", "Custom servicing"].map((s) => (
              <div key={s} className="rounded-lg border border-white/15 p-4">{s}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
