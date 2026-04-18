"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/supabaseClient";

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

  if (allowedKeys.includes(event.key)) return;

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
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data } = await supabase.auth.getSession();

      setIsLoggedIn(!!data.session);
      setChecking(false);
      if (data.session) {
        router.push("/listings");
      }    };

    checkUser();
  }, []);

  const handleSearch = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/listings");
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push('/');
  };

  if (checking) return null;

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
          {isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/myaccount")}
                className="hidden rounded-full border border-[var(--outline)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer md:inline-flex"
              >
                Moj račun
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041014] shadow-lg shadow-[var(--glow)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] cursor-pointer"
              >
                Odjava
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="hidden rounded-full border border-[var(--outline)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer md:inline-flex"
              >
                Prijava
              </button>
              <button
                onClick={() => router.push("/register")}
                className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041014] shadow-lg shadow-[var(--glow)] transition hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] cursor-pointer"
              >
                Ustvari račun
              </button>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-16 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Nepremičnine brez posrednikov
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          EstateHub poveže lastnike in kupce v eni pregledni platformi.
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Objavite oglas v nekaj minutah, sprejemajte ponudbe ter vodite vsa
          sporočila na enem mestu.
        </p>

        {/* FILTER */}
        <div className="glass-panel terminal w-full max-w-3xl rounded-3xl p-6">
          <div className="mt-4 grid gap-3">
            <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
              <span className="text-xs text-[var(--muted)]">Lokacija</span>
              <input
                type="text"
                placeholder="Ljubljana"
                className="mt-1 w-full bg-transparent outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Cena od"
                onKeyDown={blockNonNumericKeys}
                onChange={sanitizeNumericValue}
                className="input"
              />
              <input
                placeholder="Cena do"
                onKeyDown={blockNonNumericKeys}
                onChange={sanitizeNumericValue}
                className="input"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Kvadratura od"
                onKeyDown={blockNonNumericKeys}
                onChange={sanitizeNumericValue}
                className="input"
              />
              <input
                placeholder="Kvadratura do"
                onKeyDown={blockNonNumericKeys}
                onChange={sanitizeNumericValue}
                className="input"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="mt-4 w-full rounded-2xl bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:shadow-lg cursor-pointer"
          >
            Išči
          </button>
        </div>
      </main>

      <footer className="border-t border-[var(--outline)] p-6 text-xs text-[var(--muted)]">
        © 2026 EstateHub
      </footer>
    </div>
  );
}