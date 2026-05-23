import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow mb-5">001 / The scientific supply desk</div>
              <h1 className="display text-4xl md:text-5xl lg:text-6xl">
                Chemicals, glassware, equipment.<br />
                <span className="text-brand">On call</span>, not online checkout.
              </h1>
              <p className="mt-6 text-ink/70 text-base md:text-lg max-w-xl leading-snug">
                Browse a curated catalog, drop items in your cart, leave your phone number. A human calls back to confirm stock, pricing, and dispatch.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary">Browse products →</Link>
                <Link href="/services" className="btn-outline">See services</Link>
              </div>
            </div>
            <div className="md:col-span-4 hidden md:block">
              <div className="border-l border-ink/15 pl-6 py-2">
                <div className="eyebrow mb-3">How it works</div>
                <ol className="space-y-2.5 text-sm text-ink/80">
                  <li><span className="text-brand mono mr-2">01</span>Add items or write a custom request.</li>
                  <li><span className="text-brand mono mr-2">02</span>Sign in, drop your phone, place the order.</li>
                  <li><span className="text-brand mono mr-2">03</span>We call back to confirm.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/15">
          {[
            { v: "4", l: "Catalog domains" },
            { v: "0", l: "Online payments" },
            { v: "1", l: "Phone confirmation" },
            { v: "∞", l: "Custom requests" },
          ].map((s) => (
            <div key={s.l} className="px-6 first:pl-0">
              <div className="display text-4xl md:text-5xl text-brand">{s.v}</div>
              <div className="eyebrow-light mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG TILES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">002 / Catalog</div>
            <h2 className="display text-3xl md:text-4xl">What we supply</h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-ink/70 md:text-lg">
            Four working domains. Anything off-catalog goes through a free-text custom request on the cart page.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
          {[
            { n: "01", t: "Chemicals & Reagents", d: "Solvents, acids, salts, biochem reagents." },
            { n: "02", t: "Glassware & Plasticware", d: "Beakers, flasks, pipettes, tubes, columns." },
            { n: "03", t: "Lab Equipment", d: "Centrifuges, pH meters, balances, hotplates." },
            { n: "04", t: "Consumables", d: "Gloves, tips, filter paper, parafilm." },
          ].map((c) => (
            <Link key={c.n} href="/products" className="bg-white p-6 hover:bg-brand-50 transition group">
              <div className="tile-num mb-5">{c.n} / Domain</div>
              <div className="text-lg font-semibold mb-1.5 group-hover:text-brand transition">{c.t}</div>
              <p className="text-sm text-ink/60 leading-snug">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SERVICES BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="eyebrow-light mb-3">003 / Servicing</div>
            <h2 className="display text-3xl md:text-5xl text-white">
              Instrument repair,<br />on a real schedule.
            </h2>
            <p className="mt-5 text-white/70 md:text-lg max-w-lg">
              AMC, calibration, ad-hoc repair, bespoke servicing. Submit the instrument and the symptom - we send a quote.
            </p>
            <Link href="/services" className="btn-brand mt-7">Request a service →</Link>
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-px bg-white/15">
            {[
              { n: "A", t: "Instrument repair" },
              { n: "B", t: "Annual maintenance" },
              { n: "C", t: "Calibration" },
              { n: "D", t: "Custom servicing" },
            ].map((s) => (
              <div key={s.n} className="bg-ink p-6">
                <div className="eyebrow-light text-brand mb-3">{s.n}</div>
                <div className="text-base">{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">004 / Flow</div>
            <h2 className="display text-3xl md:text-4xl">Cart, call, confirm.</h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-ink/70 md:text-lg">
            Three steps from need to dispatch. No card form, no waiting on email.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {[
            { n: "01", t: "Browse or submit", d: "Add catalog items, or write a free-text custom request for anything off-catalog." },
            { n: "02", t: "Drop your phone", d: "Sign up, confirm your phone number, place the order. No payment is taken." },
            { n: "03", t: "We call back", d: "A human confirms stock and pricing on the phone. Dispatch happens after." },
          ].map((s) => (
            <div key={s.n} className="bg-white p-8">
              <div className="tile-num mb-6">{s.n} / Step</div>
              <div className="text-xl font-semibold mb-2">{s.t}</div>
              <p className="text-sm text-ink/60 leading-snug">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="eyebrow-light mb-2">Ready when you are</div>
            <h2 className="display text-2xl md:text-4xl text-white max-w-2xl">
              Place your first order without typing a card number.
            </h2>
          </div>
          <Link
            href="/products"
            className="btn bg-white text-brand hover:bg-ink hover:text-white whitespace-nowrap"
          >
            Browse catalog →
          </Link>
        </div>
      </section>
    </div>
  );
}
