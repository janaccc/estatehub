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

interface User {
  id: string;
  email: string;
  created_at: string;
  listing_count?: number;
}

const DEFAULT_ADMIN_EMAIL = "jan.topler@scv.si";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"listings" | "users">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalListings, setTotalListings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOffers, setTotalOffers] = useState(0);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    void (async () => {
      // Check if user is admin
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        router.push('/login');
        return;
      }

      const sessionEmail = (session.session.user.email ?? "").trim().toLowerCase();
      const isDefaultAdmin = sessionEmail === DEFAULT_ADMIN_EMAIL;

      if (!isDefaultAdmin) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.session.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          router.push('/listings');
          return;
        }
      }

      const [usersCountRes, listingsCountRes, offersCountRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("offers").select("id", { count: "exact", head: true }),
      ]);

      const usersCount = usersCountRes.count;
      const listingsCount = listingsCountRes.count;
      const offersCount = offersCountRes.count;

      const hasUsersCount = !usersCountRes.error && typeof usersCount === "number";
      const hasListingsCount =
        !listingsCountRes.error && typeof listingsCount === "number";
      const hasOffersCount = !offersCountRes.error && typeof offersCount === "number";

      if (hasUsersCount) setTotalUsers(usersCount);
      if (hasListingsCount) setTotalListings(listingsCount);
      if (hasOffersCount) setTotalOffers(offersCount);

      // Fetch all listings with user info
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select(`
          *,
          profiles:user_id (
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (listingsError) {
        console.error("Error fetching listings:", listingsError);
      }

      if (listingsData) {
        const listingsWithEmail = listingsData.map(listing => ({
          ...listing,
          user_email: listing.profiles?.email
        }));
        setListings(listingsWithEmail);
        if (!hasListingsCount) {
          setTotalListings(listingsWithEmail.length);
        }
      }

      // Fetch all users with listing count
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, created_at');

      if (usersError) {
        console.error("Error fetching users:", usersError);
      }

      if (usersData) {
        const usersWithListings = await Promise.all(
          usersData.map(async (profile) => {
            const { data: userListings } = await supabase
              .from('listings')
              .select('id')
              .eq('user_id', profile.id);

            return {
              id: profile.id,
              email: profile.email || 'N/A',
              created_at: profile.created_at,
              listing_count: userListings?.length || 0
            };
          })
        );
        setUsers(usersWithListings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        if (!hasUsersCount) {
          setTotalUsers(usersWithListings.length);
        }
      }

      setLoading(false);
    })();
  }, [router]);

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
      setTotalListings(totalListings - 1);
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push('/');
  };

  const getUserListings = () => {
    if (!selectedUserId) return [];
    return listings.filter(l => l.user_id === selectedUserId);
  };

  const getFilteredUsers = () => {
    return users.filter(u => 
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
          Upravljanje platforme
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Pregled in upravljanje uporabnikov ter oglasov.
        </p>

        {/* Statistics */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel terminal rounded-3xl p-6">
            <p className="text-[var(--muted)] text-sm mb-2">Skupaj uporabnikov</p>
            <p className="text-3xl font-bold text-[var(--accent)]">{totalUsers}</p>
          </div>
          <div className="glass-panel terminal rounded-3xl p-6">
            <p className="text-[var(--muted)] text-sm mb-2">Skupaj nepremičnin</p>
            <p className="text-3xl font-bold text-[var(--accent)]">{totalListings}</p>
          </div>
          <div className="glass-panel terminal rounded-3xl p-6">
            <p className="text-[var(--muted)] text-sm mb-2">Skupaj ponudb</p>
            <p className="text-3xl font-bold text-[var(--accent)]">{totalOffers}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full glass-panel terminal rounded-3xl p-6">
          <div className="flex mb-6 gap-2">
            <button
              onClick={() => {
                setActiveTab("listings");
                setSelectedUserId(null);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer ${
                activeTab === "listings"
                  ? "bg-[var(--accent)] text-[#041014]"
                  : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--outline)]"
              }`}
            >
              Nepremičnine
            </button>
            <button
              onClick={() => {
                setActiveTab("users");
                setSelectedUserId(null);
              }}
              className={`px-6 py-2 rounded-full font-semibold transition cursor-pointer ${
                activeTab === "users"
                  ? "bg-[var(--accent)] text-[#041014]"
                  : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--outline)]"
              }`}
            >
              Uporabniki
            </button>
          </div>

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Vsi oglasi ({listings.length})</h2>
              {listings.length === 0 ? (
                <p className="text-[var(--muted)]">Ni oglasov.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {listings.map((listing) => (
                    <div key={listing.id} className="bg-[var(--card)] p-4 rounded-lg shadow-md flex gap-4">
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
                        <p className="text-sm text-[var(--muted)]">
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
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="flex gap-6">
              {/* Users List */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Uporabniki ({getFilteredUsers().length})</h2>
                <input
                  type="text"
                  placeholder="Iskanje po emailu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--card)] border border-[var(--outline)] text-[var(--foreground)] placeholder-[var(--muted)] rounded-lg px-4 py-2 mb-4"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {getFilteredUsers().length === 0 ? (
                    <p className="text-[var(--muted)]">Ni rezultatov.</p>
                  ) : (
                    getFilteredUsers().map((user) => (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`w-full p-4 rounded-lg text-left transition cursor-pointer ${
                          selectedUserId === user.id
                            ? "bg-[var(--accent)] text-[#041014]"
                            : "bg-[var(--card)] text-[var(--foreground)] border border-[var(--outline)] hover:border-[var(--accent)]"
                        }`}
                      >
                        <p className="font-semibold">{user.email}</p>
                        <p className="text-xs opacity-75">
                          {user.listing_count} oglas{user.listing_count !== 1 ? 'ov' : ''} • {new Date(user.created_at).toLocaleString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* User's Listings */}
              <div className="flex-1">
                {selectedUserId ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Oglasi ({getUserListings().length})
                    </h2>
                    {getUserListings().length === 0 ? (
                      <p className="text-[var(--muted)]">Ta uporabnik nima oglasov.</p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {getUserListings().map((listing) => (
                          <div key={listing.id} className="bg-[var(--card)] p-4 rounded-lg shadow-md">
                            {listing.images.length > 0 && (
                              <Image
                                src={listing.images[0]}
                                alt={listing.title}
                                width={100}
                                height={75}
                                className="w-full h-32 object-cover rounded mb-3"
                              />
                            )}
                            <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
                            <p className="text-[var(--muted)] mb-1">{listing.location}</p>
                            <p className="text-lg font-bold text-[var(--accent)] mb-3">{listing.price} € • {listing.area} m²</p>
                            <div className="flex gap-2">
                              <Link
                                href={`/listings/${listing.id}`}
                                className="bg-[var(--accent)] text-[#041014] px-3 py-1 rounded text-sm hover:bg-[var(--accent-strong)] cursor-pointer flex-1 text-center"
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
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-[var(--muted)] text-center pt-20">Klikni na uporabnika, da vidiš njegove oglase</p>
                )}
              </div>
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
