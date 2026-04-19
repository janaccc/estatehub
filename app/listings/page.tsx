"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  area: number;
  images: string[];
  created_at: string;
}

export default function ListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [listings, filters]);

  const fetchListings = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.session.user.id)
        .single();
      setIsAdmin(profile?.role === 'admin');
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else {
      setListings(data || []);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = listings;

    if (filters.location) {
      filtered = filtered.filter((listing) =>
        listing.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((listing) => listing.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((listing) => listing.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minArea) {
      filtered = filtered.filter((listing) => listing.area >= parseFloat(filters.minArea));
    }

    if (filters.maxArea) {
      filtered = filtered.filter((listing) => listing.area <= parseFloat(filters.maxArea));
    }

    setFilteredListings(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Nalaganje...</div>;

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
          {isAdmin && (
            <button
              onClick={() => router.push("/admin")}
              className="hidden rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 cursor-pointer md:inline-flex"
            >
              Admin
            </button>
          )}
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

      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-16 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Nepremičnine na voljo
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Poiščite svojo idealno nepremičnino
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Brskajte po oglasih, filtrirajte po kriterijih in pošljite ponudbe lastnikom.
        </p>

        {/* FILTER */}
        <div className="glass-panel terminal w-full max-w-3xl rounded-3xl p-6">
          <div className="mt-4 grid gap-3">
            <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
              <span className="text-xs text-[var(--muted)]">Lokacija</span>
              <input
                type="text"
                name="location"
                placeholder="Ljubljana"
                value={filters.location}
                onChange={handleFilterChange}
                className="mt-1 w-full bg-transparent outline-none"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
                <span className="text-xs text-[var(--muted)]">Cena od (€)</span>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Cena od"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  min="0"
                  className="mt-1 w-full bg-transparent outline-none"
                />
              </label>
              <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
                <span className="text-xs text-[var(--muted)]">Cena do (€)</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Cena do"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  min="0"
                  className="mt-1 w-full bg-transparent outline-none"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
                <span className="text-xs text-[var(--muted)]">Kvadratura od</span>
                <input
                  type="number"
                  name="minArea"
                  placeholder="Kvadratura od"
                  value={filters.minArea}
                  onChange={handleFilterChange}
                  className="mt-1 w-full bg-transparent outline-none"
                />
              </label>
              <label className="rounded-2xl border border-[var(--outline)] px-4 py-3">
                <span className="text-xs text-[var(--muted)]">Kvadratura do</span>
                <input
                  type="number"
                  name="maxArea"
                  placeholder="Kvadratura do"
                  value={filters.maxArea}
                  onChange={handleFilterChange}
                  className="mt-1 w-full bg-transparent outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div key={listing.id} className="bg-[var(--card)] rounded-lg shadow-md overflow-hidden">
              {listing.images.length > 0 && (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                <p className="text-[var(--muted)] mb-2">{listing.location}</p>
                <p className="text-lg font-bold text-[var(--accent)] mb-2">{listing.price} €</p>
                <p className="text-sm text-[var(--muted)] mb-4">{listing.area} m²</p>
                <Link
                  href={`/listings/${listing.id}`}
                  className="bg-[var(--accent)] text-[#041014] px-4 py-2 rounded hover:bg-[var(--accent-strong)] cursor-pointer"
                >
                  Ogled podrobnosti
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <p className="text-center text-[var(--muted)] mt-8">Ni najdenih nepremičnin.</p>
        )}
      </main>

      <footer className="border-t border-[var(--outline)] p-6 text-xs text-[var(--muted)]">
        © 2026 EstateHub
      </footer>
    </div>
  );
}