"use client";

export default function QtyStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-stretch border border-ink/20">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 text-lg hover:bg-ink hover:text-white transition"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, parseInt(e.target.value || String(min), 10) || min))}
        className="w-14 text-center border-x border-ink/20 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-10 text-lg hover:bg-ink hover:text-white transition"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
