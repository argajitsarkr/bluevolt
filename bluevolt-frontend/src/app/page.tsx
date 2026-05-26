import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow mb-5">001 / For scholars, students, and labs in the NE</div>
              <h1 className="display text-4xl md:text-5xl lg:text-6xl">
                The big distributors<br />
                won't take your <span className="text-brand">₹2,000 order</span>.<br />
                <span className="text-ink/40">We will.</span>
              </h1>
              <p className="mt-6 text-ink/70 text-base md:text-lg max-w-2xl leading-snug">
                Blue Volt Scientific is built for researchers who need
                <b className="text-ink"> 500g of agar, a fresh box of tips, or one centrifuge tube rack</b> -
                not a ₹3 lakh institutional indent. Sourced from Kolkata, dispatched fast, no MOQ games.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary">Browse products →</Link>
                <Link href="/services" className="btn-outline">Instrument repair</Link>
              </div>
            </div>
            <div className="md:col-span-4 hidden md:block">
              <div className="border-l border-ink/15 pl-6 py-2">
                <div className="eyebrow mb-3">Order range</div>
                <div className="display text-3xl">₹1k <span className="text-ink/40">-</span> 50k</div>
                <p className="mt-3 text-sm text-ink/60 leading-snug">
                  Single bottles, small kits, replacement glassware. The orders most distributors quietly ignore.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="eyebrow-light mb-3">002 / Why this exists</div>
            <h2 className="display text-3xl md:text-4xl text-white">
              You shouldn't have to wait three weeks for one bottle of HEPES.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-5 text-white/75 text-base md:text-lg leading-snug">
            <p>
              If you're a PhD scholar or an MSc student in Tripura, Assam, or anywhere in the North East, you already know the script:
            </p>
            <ul className="space-y-2 pl-4 border-l border-white/20">
              <li><span className="text-brand">→</span> Big distributors set a ₹25,000-50,000 minimum order. Your ₹3,000 list isn't worth their warehouse trip.</li>
              <li><span className="text-brand">→</span> Institutional indents take 2-3 months. Your experiment was due last week.</li>
              <li><span className="text-brand">→</span> "Out of stock at the regional depot. We'll get back to you." They don't.</li>
            </ul>
            <p>
              Blue Volt is the small seller in the middle. We keep margins thin, source from Kolkata-based stockists daily, and dispatch whatever you need - one tube, one bottle, one rack at a time.
            </p>
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 divide-x divide-ink/10">
          {[
            { v: "₹1k", l: "Smallest order welcome" },
            { v: "0", l: "Minimum order quantity" },
            { v: "KOL", l: "Sourcing hub" },
            { v: "NE", l: "Primary dispatch zone" },
          ].map((s) => (
            <div key={s.l} className="px-6 first:pl-0">
              <div className="display text-3xl md:text-4xl text-brand">{s.v}</div>
              <div className="eyebrow mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG TILES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5">
            <div className="eyebrow mb-3">003 / Catalog</div>
            <h2 className="display text-3xl md:text-4xl">What we stock</h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-ink/70 md:text-lg">
            Four working domains. Anything off-catalog goes through a free-text custom request on the cart page - we treat it the same as a listed product.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
          {[
            { n: "01", t: "Chemicals & Reagents", d: "Solvents, acids, salts, biochem reagents - small packs preferred." },
            { n: "02", t: "Glassware & Plasticware", d: "Beakers, flasks, pipettes, tubes, columns - by the piece if you want." },
            { n: "03", t: "Lab Equipment", d: "Centrifuges, pH meters, balances, hotplates, microscopes." },
            { n: "04", t: "Consumables", d: "Gloves, tips, filter paper, parafilm - the weekly-reorder items." },
          ].map((c) => (
            <Link key={c.n} href="/products" className="bg-white p-6 hover:bg-brand-50 transition group">
              <div className="tile-num mb-5">{c.n} / Domain</div>
              <div className="text-lg font-semibold mb-1.5 group-hover:text-brand transition">{c.t}</div>
              <p className="text-sm text-ink/60 leading-snug">{c.d}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* WHO IS THIS FOR */}
      <section className="bg-brand-50 border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="eyebrow mb-3">004 / Who this is for</div>
          <h2 className="display text-3xl md:text-4xl mb-10">If any of these sound like you, you're in the right place.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
            {[
              {
                t: "PhD scholar mid-experiment",
                d: "Ran out of a single reagent. Your guide's project account isn't for ₹800 emergency buys. You need it this week.",
              },
              {
                t: "MSc dissertation student",
                d: "Small personal budget. Bought-only-what-you-need is the only way to get through the methods chapter.",
              },
              {
                t: "Assistant professor with new lab",
                d: "Setting up bench-by-bench. One balance, two pipettes, a starter kit - not a turnkey package deal.",
              },
              {
                t: "Tech-support / lab manager",
                d: "Need a quick instrument service or one spare part. Big AMC contracts are overkill for a single fix.",
              },
              {
                t: "College department",
                d: "Running practicals with a small replenishment list. Nothing your usual vendor will quote against.",
              },
              {
                t: "Anyone the big vendors ignore",
                d: "If you've heard 'minimum order' more than twice this year, this site is built for you.",
              },
            ].map((c) => (
              <div key={c.t} className="bg-white p-6">
                <div className="text-base font-semibold mb-2">{c.t}</div>
                <p className="text-sm text-ink/60 leading-snug">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES BAND */}
      <section className="bg-ink text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <div className="eyebrow-light mb-3">005 / Servicing</div>
            <h2 className="display text-3xl md:text-5xl text-white">
              Spot repairs<br />without an AMC contract.
            </h2>
            <p className="mt-5 text-white/70 md:text-lg max-w-lg">
              One-off repair on a misbehaving centrifuge. A calibration before a key experiment. The same small-ticket philosophy - no annual contract required.
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
            <div className="eyebrow mb-3">006 / Flow</div>
            <h2 className="display text-3xl md:text-4xl">Cart, call, confirm.</h2>
          </div>
          <p className="md:col-span-6 md:col-start-7 text-ink/70 md:text-lg">
            Three steps from need to dispatch. No card form online - the call lets us re-check stock and lock pricing before money moves.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-ink/15 border border-ink/15">
          {[
            { n: "01", t: "Browse or submit", d: "Add catalog items, or write a free-text custom request for anything off-catalog." },
            { n: "02", t: "Drop your phone", d: "Sign up, confirm your phone number, place the order. No payment is taken." },
            { n: "03", t: "We call back", d: "A human confirms stock from the Kolkata source + pricing. Dispatch happens after." },
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
              Your small order is welcome here.
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
