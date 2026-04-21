"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import Image from "next/image";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  area: number;
  images: string[];
  created_at: string;
  user_id: string;
}

interface Offer {
  id: string;
  offer_amount: number;
  message: string;
  created_at: string;
  status?: string | null;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [decidingOfferId, setDecidingOfferId] = useState<string | null>(null);

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    if (listing) {
      checkAuth();
    }
  }, [listing]);

  useEffect(() => {
    if (isOwner) {
      fetchOffers();
    }
  }, [isOwner]);

  const fetchListing = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching listing:", error);
    } else {
      setListing(data);
    }
    setLoading(false);
  };

  const checkAuth = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data } = await supabase.auth.getSession();
    const loggedIn = !!data.session;
    setIsLoggedIn(loggedIn);
    if (loggedIn && listing) {
      setIsOwner(data.session.user.id === listing.user_id);
    }
  };

  const fetchOffers = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .eq("listing_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching offers:", error);
    } else {
      setOffers(data || []);
    }
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { error } = await supabase
      .from("offers")
      .insert({
        listing_id: id,
        user_id: session.session.user.id,
        offer_amount: parseFloat(offerAmount),
        message: offerMessage,
      });

    if (error) {
      console.error("Error sending offer:", error);
      alert("Napaka pri pošiljanju ponudbe");
    } else {
      alert("Ponudba poslana!");
      setShowOfferForm(false);
      setOfferAmount("");
      setOfferMessage("");
      fetchOffers();
    }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push('/');
  };

  const handleOfferDecision = async (offerId: string, decision: "accept" | "reject") => {
    if (decidingOfferId) return;

    setDecidingOfferId(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        alert(payload?.error || "Napaka pri obdelavi ponudbe");
        return;
      }

      await fetchListing();
      await fetchOffers();
    } finally {
      setDecidingOfferId(null);
    }
  };

  const nextImage = () => {
    if (!listing || listing.images.length === 0) return;

    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    if (!listing || listing.images.length === 0) return;

    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">Nalaganje...</div>;

  if (!listing) return <div className="min-h-screen flex items-center justify-center text-[var(--foreground)]">Oglas ni najden.</div>;

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

      <main className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 px-6 pb-16 pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--outline)] bg-[var(--card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          Podrobnosti oglasa
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {listing.title}
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Ogledajte vse podrobnosti oglasa in pošljite ponudbo če vas zanima.
        </p>

        {/* Images Slideshow */}
        <div className="w-full glass-panel terminal rounded-3xl p-6">
          {listing.images.length > 0 && (
            <div className="relative mb-6">
              <Image
                src={listing.images[currentImageIndex]}
                alt={`Slika ${currentImageIndex + 1}`}
                width={800}
                height={400}
                className="w-full h-80 object-cover rounded-lg cursor-pointer"
                onClick={() => openModal(currentImageIndex)}
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[var(--card)] text-[var(--foreground)] p-2 rounded-full shadow-lg hover:bg-[var(--accent)] hover:text-[#041014] cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[var(--card)] text-[var(--foreground)] p-2 rounded-full shadow-lg hover:bg-[var(--accent)] hover:text-[#041014] cursor-pointer"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? 'bg-[var(--accent)]' : 'bg-[var(--muted)]'
                        } cursor-pointer`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Details */}
          <div className="bg-[var(--card)] p-6 rounded-lg shadow-md mb-6">
            <p className="text-[var(--muted)] mb-2"><strong>Lokacija:</strong> {listing.location}</p>
            <p className="text-lg font-bold text-[var(--accent)] mb-2"><strong>Cena:</strong> {listing.price} €</p>
            <p className="text-sm text-[var(--muted)] mb-4"><strong>Kvadratura:</strong> {listing.area} m²</p>
            <p className="text-[var(--foreground)]">{listing.description}</p>
          </div>

          {/* Send Offer Button */}
          {isLoggedIn && !isOwner && (
            <button
              onClick={() => setShowOfferForm(!showOfferForm)}
              className="bg-[var(--accent)] text-[#041014] px-6 py-2 rounded hover:bg-[var(--accent-strong)] mb-4 cursor-pointer"
            >
              {showOfferForm ? "Prekliči" : "Pošlji ponudbo"}
            </button>
          )}

          {/* Offer Form */}
          {showOfferForm && !isOwner && (
            <form onSubmit={handleSendOffer} className="bg-[var(--card)] p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-4">Pošlji ponudbo</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Znesek ponudbe (€)</label>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  required
                  min="0"
                  className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sporočilo</label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={4}
                  className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
                />
              </div>
              <button type="submit" className="bg-[var(--accent)] text-[#041014] px-4 py-2 rounded hover:bg-[var(--accent-strong)] cursor-pointer">
                Pošlji
              </button>
            </form>
          )}

          {/* Offers (only for owner) */}
          {isOwner && (
            <div className="bg-[var(--card)] p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Prejete ponudbe</h3>
              <button onClick={fetchOffers} className="bg-[var(--accent)] text-[#041014] px-4 py-2 rounded mb-4 cursor-pointer">
                Osveži ponudbe
              </button>
              {offers.length === 0 ? (
                <p>Ni ponudb.</p>
              ) : (
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border p-4 rounded bg-[var(--card)]">
                      <p><strong>Znesek:</strong> {offer.offer_amount} €</p>
                      <p><strong>Sporočilo:</strong> {offer.message}</p>
                      <p className="text-sm text-[var(--muted)]">{new Date(offer.created_at).toLocaleString()}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {(offer.status === "accepted" ||
                          offer.status === "rejected" ||
                          (!offer.status && listing.price === offer.offer_amount)) && (
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              offer.status === "rejected"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-green-500/15 text-green-400"
                            }`}
                          >
                            {offer.status === "rejected" ? "Zavrnjeno" : "Sprejeto"}
                          </span>
                        )}

                        {offer.status !== "accepted" &&
                          offer.status !== "rejected" &&
                          !(listing.price === offer.offer_amount) && (
                            <>
                              <button
                                onClick={() => handleOfferDecision(offer.id, "accept")}
                                disabled={!!decidingOfferId}
                                className="rounded bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                              >
                                Sprejmi
                              </button>
                              <button
                                onClick={() => handleOfferDecision(offer.id, "reject")}
                                disabled={!!decidingOfferId}
                                className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                              >
                                Zavrni
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[var(--outline)] p-6 text-xs text-[var(--muted)]">
        © 2026 EstateHub
      </footer>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full p-4">
            <Image
              src={listing.images[currentImageIndex]}
              alt={`Slika ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200"
                >
                  ›
                </button>
              </>
            )}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
