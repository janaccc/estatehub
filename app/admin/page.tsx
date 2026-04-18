"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  images: string[];
  created_at: string;
  user_id: string;
  user_email?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAndFetchListings();
  }, []);

  const checkAdminAndFetchListings = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Check if user is admin
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/listings');
      return;
    }

    setUserRole(profile.role);

    // Fetch all listings with user info
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        profiles:user_id (
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      const listingsWithEmail = data?.map(listing => ({
        ...listing,
        user_email: listing.profiles?.email
      })) || [];
      setListings(listingsWithEmail);
    }
    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    if (!confirm("Ali ste prepričani, da želite izbrisati ta oglas?")) return;

    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting listing:", error);
      alert("Napaka pri brisanju oglasa");
    } else {
      setListings(listings.filter(l => l.id !== id));
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">Nalaganje...</div>;

  return (
    <div className="min-h-screen text-[var(--foreground)]">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8">
        <Link href="/listings" className="flex items-center gap-3 cursor-pointer">
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
          Upravljanje nepremičnin
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Pregled vseh oglasov, brisanje neprimernih vsebin.
        </p>

        <div className="w-full glass-panel terminal rounded-3xl p-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Vsi oglasi ({listings.length})</h2>
          </div>

          {listings.length === 0 ? (
            <p className="text-[var(--muted)]">Ni oglasov.</p>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-[var(--card)] p-4 rounded-lg shadow-md">
                  <div className="flex gap-4">
                    {listing.images.length > 0 && (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        width={100}
                        height={75}
                        className="w-24 h-18 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                      <p className="text-[var(--muted)] mb-1">{listing.location}</p>
                      <p className="text-lg font-bold text-[var(--accent)] mb-1">{listing.price} €</p>
                      <p className="text-sm text-[var(--muted)] mb-2">{listing.area} m²</p>
                      <p className="text-xs text-[var(--muted)]">
                        Objavil: {listing.user_email} | {new Date(listing.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="bg-[var(--accent)] text-[#041014] px-3 py-1 rounded text-sm hover:bg-[var(--accent-strong)] cursor-pointer text-center"
                      >
                        Ogled
                      </Link>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 cursor-pointer"
                      >
                        Izbriši
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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