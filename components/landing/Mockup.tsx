export function Mockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ring-1 ring-slate-900/5">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="ml-3 text-xs text-slate-400">app.invoicely.com/dashboard</span>
      </div>
      <div className="grid grid-cols-12 gap-0">
        <div className="hidden border-r border-slate-100 bg-white p-4 sm:col-span-3 sm:block lg:col-span-2">
          <div className="flex items-center gap-2 pb-3">
            <div className="h-6 w-6 rounded-md bg-[#0c1a3a]" />
            <div className="h-3 w-16 rounded bg-slate-200" />
          </div>
          {["bg-brand-100", "bg-slate-100", "bg-slate-100", "bg-slate-100"].map((b, i) => (
            <div key={i} className={`mt-1 flex h-7 items-center gap-2 rounded px-2 ${b}`}>
              <div className="h-2.5 w-2.5 rounded bg-slate-300" />
              <div className="h-2 w-12 rounded bg-slate-300" />
            </div>
          ))}
        </div>
        <div className="col-span-12 p-5 sm:col-span-9 lg:col-span-10">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="h-4 w-44 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-64 rounded bg-slate-100" />
            </div>
            <div className="h-8 w-28 rounded-lg bg-brand-600" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: "$86,788", c: "bg-emerald-50 text-emerald-700", t: "+12.4%" },
              { v: "$12,420", c: "bg-amber-50 text-amber-700", t: "3 unpaid" },
              { v: "9", c: "bg-blue-50 text-blue-700", t: "active" },
            ].map((s, i) => (
              <div key={i} className="rounded-lg border border-slate-100 bg-white p-3">
                <div className="h-2.5 w-16 rounded bg-slate-200" />
                <div className="mt-2 text-xl font-semibold text-slate-900">{s.v}</div>
                <div className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${s.c}`}>
                  {s.t}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex h-32 items-end gap-1.5 rounded-lg border border-slate-100 bg-white p-3">
            {[40, 65, 30, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-brand-500"
                style={{ height: `${h}%`, opacity: 0.3 + i * 0.06 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
