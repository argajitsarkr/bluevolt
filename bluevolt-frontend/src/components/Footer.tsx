export default function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-ink/70 flex flex-col md:flex-row gap-4 justify-between">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bluevolt-logo.png" alt="Blue Volt Scientific" className="h-9 w-auto" />
          <div className="mt-2">Chemicals - Glassware - Equipment - Servicing</div>
        </div>
        <div className="text-xs">© {new Date().getFullYear()} Blue Volt Scientific. No online payments - we call to confirm every order.</div>
      </div>
    </footer>
  );
}
