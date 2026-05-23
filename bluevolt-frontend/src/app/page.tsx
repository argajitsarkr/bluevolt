import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="eyebrow mb-8">001 / The scientific supply desk</div>
          <h1 className="display text-6xl md:text-8xl lg:text-9xl">
            Chemicals.<br />
            Glassware.<br />
            <span className="text-brand">Equipment</span>.<br />
            <span className="text-ink/40">On call.</span>
          </h1>
          <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
            <p className="md:col-span-7 text-xl text-ink/70 max-w-2xl leading-snug">
              Browse a curated catalog, drop items in your cart, leave your phone number.
              A human calls back to confirm stock, price, and dispatch. No checkout, no card form, no waiting on email.
            </p>
            <div className="md:col-span-5 flex gap-3 md:justify-end">
              <Link href="/products" className="btn-primary">Browse products →</Link>
              <Link href="/services" className="btn-outline">Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/15">
          {[
            { v: "4", l: "Catalog domains" },
            { v: "0", l: "Online payments" },
            { v: "1", l: "Phone call to confirm" },
            { v: "∞", l: "Custom requests" },
          ].map((s) => (
            <div key={s.l} className="px-6 first:pl-0">
              <div className="display text-5xl md:text-6xl text-brand">{s.v}</div>
              <div className="eyebrow-light mt-3">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG TILES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          <div className="md:col-span-4">
            <div className="eyebrow mb-3">002 / Catalog</div>
            <h2 className="display text-4xl md:text-5xl">What we supply</h2>
          </div>
          <p className="md:col-span-7 md:col-start-6 text-ink/70 text-lg">
            Four working domains. Browse each, or jump straight to a custom request if you need
            something that isn't listed - which is most of the long tail of any real lab.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15">
          {[
            { n: "01", t: "Chemicals & Reagents", d: "Solvents, acids, salts, biochem reagents - bench-grade and analytical." },
            { n: "02", t: "Glassware & Plasticware", d: "Beakers, flasks, pipettes, tubes, columns." },
            { n: "03", t: "Lab Equipment", d: "Centrifuges, pH meters, balances, hotplates, microscopes." },
            { n: "04", t: "Consumables", d: "Gloves, tips, filter paper, parafilm - the things you reorder weekly." },
          ].map((c) => (
            <Link key={c.n} href="/products" className="bg-white p-8 hover:bg-brand-50 transition">
              <div className="tile-num mb-6">{c.n} / Domain</div>
              <div className="text-xl font-semibold mb-2">{c.t}</div>
              <p className="text-sm text-ink/60">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="eyebrow-light mb-4">003 / Servicing</div>
            <h2 className="display text-4xl md:text-6xl text-white">
              Instrument repair,<br />on a real schedule.
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-lg">
              AMC, calibration, ad-hoc repair, bespoke servicing. Submit the instrument and
              the symptom - we send a quote.
            </p>
            <Link href="/services" className="btn-brand mt-8">Request a service →</Link>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-px bg-white/15">
            {[
              { n: "A", t: "Instrument repair" },
              { n: "B", t: "Annual maintenance" },
              { n: "C", t: "Calibration" },
              { n: "D", t: "Custom servicing" },
            ].map((s) => (
              <div key={s.n} className="bg-ink p-8">
                <div className="eyebrow-light text-brand mb-4">{s.n}</div>
                <div className="text-lg">{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="eyebrow mb-3">004 / How it works</div>
        <h2 className="display text-4xl md:text-5xl mb-14">Cart, call, confirm.</h2>
        <div className="grid md:grid-cols-3 gap-px bg-ink/15">
          {[
            { n: "01", t: "Browse or submit", d: "Add catalog items to your cart, or write a free-text custom request for anything off-catalog." },
            { n: "02", t: "Drop your phone", d: "Sign up, confirm your phone number, and place the order. No payment is taken." },
            { n: "03", t: "We call back", d: "A human confirms stock and pricing on the phone. Dispatch happens after that, not before." },
          ].map((s) => (
            <div key={s.n} className="bg-white p-10">
              <div className="tile-num mb-8">{s.n} / Step</div>
              <div className="text-2xl font-semibold mb-3">{s.t}</div>
              <p className="text-ink/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="eyebrow-light mb-3">Ready when you are</div>
            <h2 className="display text-3xl md:text-5xl text-white max-w-2xl">
              Place your first order without typing a card number.
            </h2>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="btn-ghost-light bg-white text-brand border-white hover:bg-ink hover:text-white hover:border-ink">
              Browse catalog →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
