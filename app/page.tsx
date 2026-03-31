"use client";

const blockNonNumericKeys = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Home",
    "End",
  ];

  if (allowedKeys.includes(event.key)) {
    return;
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
};

const sanitizeNumericValue = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "");
};

export default function Home() {
  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--card)] text-sm font-semibold text-[var(--accent)] shadow-[0_0_18px_var(--glow)]">
            EH
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              EstateHub
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              nepremicnine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-[var(--outline)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] md:inline-flex">
            Prijava
          </button>
          <button className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041014] shadow-lg shadow-[var(--glow)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
            Ustvari racun
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-16 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Nepremicnine brez posrednikov
        </div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl">
          EstateHub poveze lastnike in kupce v eni pregledni platformi.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Objavite oglas v nekaj minutah, sprejemajte ponudbe ter vodite vsa
          sporocila na enem mestu. Transparentno, hitro in brez nepotrebnih
          posrednikov.
        </p>
        <div className="glass-panel terminal w-full max-w-3xl rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Iskalni filter
              </p>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
                Najdite pravo nepremicnino
              </h2>
            </div>
            <span className="rounded-full border border-[var(--outline)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              Prijava
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            <label className="rounded-2xl border border-[var(--outline)] bg-[rgba(15,22,34,0.9)] px-4 py-3">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Lokacija
              </span>
              <input
                type="text"
                placeholder="Ljubljana, okolica"
                className="mt-1 w-full bg-transparent text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="relative rounded-2xl border border-[var(--outline)] bg-[rgba(15,22,34,0.9)] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Cena od
                </span>
                <span className="pointer-events-none absolute left-4 top-[2.1rem] text-sm font-semibold text-[var(--muted)]">
                  €
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="200000"
                  onKeyDown={blockNonNumericKeys}
                  onChange={sanitizeNumericValue}
                  className="mt-1 w-full bg-transparent pl-5 text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </label>
              <label className="relative rounded-2xl border border-[var(--outline)] bg-[rgba(15,22,34,0.9)] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Cena do
                </span>
                <span className="pointer-events-none absolute left-4 top-[2.1rem] text-sm font-semibold text-[var(--muted)]">
                  €
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="450000"
                  onKeyDown={blockNonNumericKeys}
                  onChange={sanitizeNumericValue}
                  className="mt-1 w-full bg-transparent pl-5 text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="relative rounded-2xl border border-[var(--outline)] bg-[rgba(15,22,34,0.9)] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Kvadratura od
                </span>
                <span className="pointer-events-none absolute right-4 top-[2.1rem] text-sm font-semibold text-[var(--muted)]">
                  m2
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="60"
                  onKeyDown={blockNonNumericKeys}
                  onChange={sanitizeNumericValue}
                  className="mt-1 w-full bg-transparent pr-9 text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </label>
              <label className="relative rounded-2xl border border-[var(--outline)] bg-[rgba(15,22,34,0.9)] px-4 py-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Kvadratura do
                </span>
                <span className="pointer-events-none absolute right-4 top-[2.1rem] text-sm font-semibold text-[var(--muted)]">
                  m2
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="120"
                  onKeyDown={blockNonNumericKeys}
                  onChange={sanitizeNumericValue}
                  className="mt-1 w-full bg-transparent pr-9 text-sm font-semibold text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                />
              </label>
            </div>
          </div>
          <a
            href="/login"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[#0b0f14] transition hover:bg-[var(--accent)]"
            aria-label="Isci (prijava)"
          >
            Išči
          </a>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#041014] shadow-lg shadow-[var(--glow)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]">
            Ustvari racun
          </button>
          <button className="rounded-full border border-[var(--outline)] px-6 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[rgba(79,209,197,0.1)]">
            Prijava
          </button>
        </div>
      </main>

      <footer className="border-t border-[var(--outline)] bg-[rgba(9,13,20,0.85)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs uppercase tracking-[0.3em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 EstateHub</span>
          <span>Vse pravice pridrzane</span>
        </div>
      </footer>
    </div>
  );
}
