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
}

interface Offer {
  id: string;
  listing_id: string;
  offer_amount: number;
  message: string;
  created_at: string;
}

export default function MyAccountPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "offers">("listings");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userCreatedAt, setUserCreatedAt] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const userId = session.session.user.id;
    const userEmail = session.session.user.email || "";
    const userCreatedAt = session.session.user.created_at || "";

    setUserEmail(userEmail);
    setUserCreatedAt(userCreatedAt);
    // Extract username from email (before @)
    setUsername(userEmail.split("@")[0]);

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    setIsAdmin(profile?.role === 'admin');

    // Fetch user's listings
    const { data: listingsData, error: listingsError } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userId);

    if (listingsError) {
      console.error("Error fetching listings:", listingsError);
    } else {
      setListings(listingsData || []);
    }

    // Fetch offers on user's listings
    const { data: offersData, error: offersError } = await supabase
      .from("offers")
      .select("*")
      .in("listing_id", listingsData?.map(l => l.id) || [])
      .order("created_at", { ascending: false });

    if (offersError) {
      console.error("Error fetching offers:", offersError);
    } else {
      setOffers(offersData || []);
    }

    setLoading(false);
  };

  const deleteListing = async (id: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

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
          Moj račun
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Upravljajte s svojimi oglasi in ponudbami
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Ogledajte svoje objavljene oglase, urejajte jih, brišite ali ogledujte prejete ponudbe.
        </p>

        {/* User Account Info */}
        <div className="w-full glass-panel terminal rounded-3xl p-8">
          <h2 className="text-2xl font-semibold mb-6">Podatki računa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[var(--muted)] text-sm mb-1">Uporabniško ime</p>
              <p className="text-lg font-semibold">{username}</p>
            </div>
            <div>
              <p className="text-[var(--muted)] text-sm mb-1">Email</p>
              <p className="text-lg font-semibold">{userEmail}</p>
            </div>
            <div>
              <p className="text-[var(--muted)] text-sm mb-1">Datum prijave</p>
              <p className="text-lg font-semibold">{new Date(userCreatedAt).toLocaleString('sl-SI')}</p>
            </div>
            <div>
              <p className="text-[var(--muted)] text-sm mb-1">Število oglasov</p>
              <p className="text-lg font-semibold">{listings.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full glass-panel terminal rounded-3xl p-6">
          <div className="flex mb-6">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-2 ${activeTab === "listings" ? "bg-[var(--accent)] text-[#041014]" : "bg-[var(--card)] text-[var(--foreground)]"} rounded-l cursor-pointer`}
            >
              Moji oglasi
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-4 py-2 ${activeTab === "offers" ? "bg-[var(--accent)] text-[#041014]" : "bg-[var(--card)] text-[var(--foreground)]"} rounded-r cursor-pointer`}
            >
              Prejete ponudbe
            </button>
          </div>

          {/* Add Listing Button */}
          <Link
            href="/post-listing"
            className="bg-[var(--accent)] text-[#041014] px-6 py-2 rounded hover:bg-[var(--accent-strong)] cursor-pointer inline-block mb-6"
          >
            Dodaj nov oglas
          </Link>

          {/* Listings Tab */}
          {activeTab === "listings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
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
                    <div className="flex gap-2">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="bg-[var(--accent)] text-[#041014] px-3 py-1 rounded text-sm hover:bg-[var(--accent-strong)] cursor-pointer"
                      >
                        Ogled
                      </Link>
                      <Link
                        href={`/edit-listing/${listing.id}`}
                        className="bg-[var(--accent)] text-[#041014] px-3 py-1 rounded text-sm hover:bg-[var(--accent-strong)] cursor-pointer"
                      >
                        Uredi
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
              {listings.length === 0 && (
                <p className="col-span-full text-center text-[var(--muted)]">Nimate še nobenega oglasa.</p>
              )}
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              {offers.map((offer) => {
                const listing = listings.find(l => l.id === offer.listing_id);
                return (
                  <div key={offer.id} className="bg-[var(--card)] p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">{listing?.title}</h3>
                    <p><strong>Znesek:</strong> {offer.offer_amount} €</p>
                    <p><strong>Sporočilo:</strong> {offer.message}</p>
                    <p className="text-sm text-[var(--muted)]">{new Date(offer.created_at).toLocaleString()}</p>
                  </div>
                );
              })}
              {offers.length === 0 && (
                <p className="text-center text-[var(--muted)]">Ni ponudb.</p>
              )}
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