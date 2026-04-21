"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/supabaseClient";

const DEFAULT_ADMIN_EMAIL = "jan.topler@scv.si";

interface UserProfile {
  id: string;
  email: string | null;
  created_at: string;
  role?: string | null;
}

function getDisplayNameFromEmail(email: string | null) {
  if (!email) return "N/A";
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [totalListings, setTotalListings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    void (async () => {
      const { data: session } = await supabase.auth.getSession();

      if (!session.session) {
        router.push("/login");
        return;
      }

      const sessionEmail = (session.session.user.email ?? "").trim().toLowerCase();
      const isDefaultAdmin = sessionEmail === DEFAULT_ADMIN_EMAIL;

      if (!isDefaultAdmin) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.session.user.id)
          .single();

        if (profileError || profile?.role !== "admin") {
          router.push("/listings");
          return;
        }
      }

      const [listingsCountRes, usersCountRes] = await Promise.all([
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      if (!listingsCountRes.error && typeof listingsCountRes.count === "number") {
        setTotalListings(listingsCountRes.count);
      }

      if (!usersCountRes.error && typeof usersCountRes.count === "number") {
        setTotalUsers(usersCountRes.count);
      }

      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("id, email, created_at, role")
        .order("created_at", { ascending: false })
        .limit(500);

      if (usersError) {
        console.error("Error fetching users:", usersError);
      } else {
        setUsers((usersData as UserProfile[]) ?? []);
      }

      setLoading(false);
    })();
  }, [router]);

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/");
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = normalizedQuery
    ? users.filter((u) => {
        const email = (u.email ?? "").toLowerCase();
        const displayName = getDisplayNameFromEmail(u.email).toLowerCase();
        return email.includes(normalizedQuery) || displayName.includes(normalizedQuery);
      })
    : users;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">
        Nalaganje...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <Link href="/listings" className="flex items-center gap-3 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--card)] text-sm font-semibold text-[var(--accent)] shadow-[0_0_18px_var(--glow)]">
            EH
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">EstateHub</p>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              nepremicnine
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
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
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 pb-16 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Admin Panel
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Pregled platforme
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Pregled statistike in uporabnikov.
        </p>

        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="glass-panel terminal rounded-3xl p-6">
            <p className="text-[var(--muted)] text-sm mb-2">Skupaj uporabnikov</p>
            <p className="text-3xl font-bold text-[var(--accent)]">{totalUsers}</p>
          </div>
          <div className="glass-panel terminal rounded-3xl p-6">
            <p className="text-[var(--muted)] text-sm mb-2">
              Skupaj objavljenih nepremičnin
            </p>
            <p className="text-3xl font-bold text-[var(--accent)]">{totalListings}</p>
          </div>
        </div>

        <div className="w-full glass-panel terminal rounded-3xl p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold">Uporabniki ({filteredUsers.length})</h2>
            <input
              type="text"
              placeholder="Išči po imenu ali emailu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted)] md:max-w-md"
            />
          </div>

          {filteredUsers.length === 0 ? (
            <p className="mt-6 text-[var(--muted)]">Ni rezultatov.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--outline)] text-[var(--muted)]">
                    <th className="py-3 pr-4 font-semibold">Ime</th>
                    <th className="py-3 pr-4 font-semibold">Email</th>
                    <th className="py-3 pr-4 font-semibold">Vloga</th>
                    <th className="py-3 pr-4 font-semibold">Ustvarjen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-[var(--outline)]/50">
                      <td className="py-3 pr-4 font-semibold">
                        {getDisplayNameFromEmail(u.email)}
                      </td>
                      <td className="py-3 pr-4">{u.email ?? "N/A"}</td>
                      <td className="py-3 pr-4">{u.role ?? "user"}</td>
                      <td className="py-3 pr-4">
                        {new Date(u.created_at).toLocaleString("sl-SI")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[var(--outline)] p-6 text-xs text-[var(--muted)]">
        © 2026 EstateHub
      </footer>
    </div>
  );
}
