/** Shared pieces of the calculators: result card, detail rows, share and print bar, locked state field. */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { formatMoney, formatNumber } from '../../lib/format';

export const usd = (n: number) => formatMoney(Math.round(n), 0);
export const usd2 = (n: number) => formatMoney(n, Number.isInteger(n) ? 0 : 2);
export const pc = (n: number, d = 1) => `${formatNumber(n, d)}%`;

export function LockedField({ label, value, help, className = '' }: { label: string; value: string; help?: string; className?: string }) {
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <span className="mb-1 block text-sm font-medium text-navy-700">{label}</span>
      <p className="flex h-12 items-center rounded-lg border border-navy-200 bg-navy-50 px-4 font-semibold text-navy-900">{value}</p>
      <span className="mt-1 text-xs text-navy-500">{help ?? ''}</span>
    </div>
  );
}

export function Rows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
      {rows.map(([l, x], i) => <tr key={`${l}-${i}`}><td className="py-1.5 pr-3 text-navy-700">{l}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{x}</td></tr>)}
    </tbody></table>
  );
}

export function Result({ label, value, sub, children, methodHref, note }: { label: string; value: string; sub?: string; children?: ReactNode; methodHref: string; note: string }) {
  const [copied, setCopied] = useState(false);
  // Phone: while the result card is below the screen, a bar pinned to the bottom shows the key figure (RECETTE §5, 2026-10-11).
  const card = useRef<HTMLDivElement>(null);
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const el = card.current;
    // Only the page's main result gets the bar (a state page also has the Section 8 lookup further down).
    if (!el || typeof IntersectionObserver === 'undefined' || document.querySelector('main [data-resultat]') !== el) return;
    const io = new IntersectionObserver(([e]) => setBelow(!e.isIntersecting && e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const copy = () => { navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  return (
    <div ref={card} aria-live="polite" data-resultat className="rounded-xl bg-accent-50 p-4 sm:p-5">
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-navy-700">{sub}</p>}
      {children}
      <p className="mt-3 text-xs text-navy-600">{note} <a className="underline" href={methodHref}>How this is calculated</a>.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={copy} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">{copied ? 'Link copied' : 'Copy share link'}</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
      </div>
      {below && (
        <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => card.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="fixed inset-x-0 bottom-0 z-40 flex items-baseline justify-between gap-3 border-t border-accent-200 bg-accent-50 px-4 py-3 text-left shadow-lg lg:hidden">
          <span className="min-w-0 truncate text-sm font-medium text-navy-700">{label}</span>
          <span className="tabular-nums shrink-0 whitespace-nowrap text-xl font-bold text-navy-900">{value}</span>
        </button>
      )}
    </div>
  );
}

/** Bar showing a value against a limit (income against the program threshold). */
export function Meter({ value, limit, label }: { value: number; limit: number; label: string }) {
  const share = limit > 0 ? Math.min(1, value / limit) : 1;
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-navy-700"><span>{label}</span><span className="tabular-nums">{usd(value)} of {usd(limit)}</span></div>
      <div className="mt-1 h-2 w-full rounded bg-white"><div className={`h-2 rounded ${value <= limit ? 'bg-accent-500' : 'bg-amber-600'}`} style={{ width: `${Math.round(share * 100)}%` }} /></div>
    </div>
  );
}

export const sizeOptions = (max = 10) => Array.from({ length: max }, (_, i) => ({ value: String(i + 1), label: i === 0 ? '1 person' : `${i + 1} people` }));
