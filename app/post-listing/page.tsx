"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    contact_email: "",
    contact_phone: "",
    price: "",
    area: "",
  });
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([""]);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      const newPreviews = [...imagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setImagePreviews(newPreviews);

      // If this is the last input and a file was added, add a new input
      if (index === images.length - 1) {
        setImages([...newImages, null]); // Add placeholder
        setImagePreviews([...newPreviews, ""]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const openModal = (imageSrc: string) => {
    setModalImage(imageSrc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage("");
  };

  const uploadImages = async (): Promise<string[]> => {
    const supabase = getSupabase();
    if (!supabase) return [];

    const uploadedUrls: string[] = [];
    const validImages = images.filter((img): img is File => img !== null);

    for (const image of validImages) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `listings/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, image);

      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (data) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const supabase = getSupabase();
    if (!supabase) return;

    const contactEmail = formData.contact_email.trim();
    const contactPhone = formData.contact_phone.trim();

    if (!contactEmail && !contactPhone) {
      alert("Vnesite vsaj e-pošto ali telefonsko številko za kontakt.");
      setUploading(false);
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      alert("Morate biti prijavljeni");
      return;
    }

    const imageUrls = await uploadImages();

    const { error } = await supabase
      .from("listings")
      .insert({
        user_id: session.session.user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        images: imageUrls,
      });

    if (error) {
      console.error("Error posting listing:", error);
      const message = (error as { message?: string } | null)?.message || "";
      if (message.includes("contact_email") || message.includes("contact_phone")) {
        alert('Kontaktna polja še niso dodana v bazo. Dodaj stolpca "contact_email" in "contact_phone" v tabelo "listings".');
      } else {
        alert("Napaka pri objavi oglasa");
      }
    } else {
      alert("Oglas objavljen!");
      router.push("/myaccount");
    }

    setUploading(false);
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
          Objavi oglas
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Objavite svoj oglas za nepremičnino
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Izpolnite obrazec z vsemi potrebnimi podatki in naložite slike za privlačen oglas.
        </p>

        <form onSubmit={handleSubmit} className="w-full glass-panel terminal rounded-3xl p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Naslov</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Opis</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Lokacija</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kontakt e-pošta</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              placeholder="npr. ime@domena.si"
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kontakt telefon</label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              placeholder="npr. +386 40 123 456"
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
            <p className="mt-2 text-xs text-[var(--muted)]">Izpolnite vsaj e-pošto ali telefonsko številko.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Cena (€)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kvadratura (m²)</label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              required
              className="w-full border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Slike</label>
            {images.map((_, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(index)}
                  className="flex-1 border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Odstrani
                  </button>
                )}
              </div>
            ))}
            {imagePreviews.filter(p => p).length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {imagePreviews.filter(p => p).map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Predogled ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer"
                    onClick={() => openModal(preview)}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-[var(--accent)] text-[#041014] px-6 py-2 rounded hover:bg-[var(--accent-strong)] disabled:opacity-50 cursor-pointer"
          >
            {uploading ? "Nalaganje..." : "Objavi oglas"}
          </button>
        </form>
      </main>

      <footer className="border-t border-[var(--outline)] p-6 text-xs text-[var(--muted)]">
        © 2026 EstateHub
      </footer>

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={modalImage}
              alt="Povečana slika"
              className="max-w-full max-h-full object-contain"
            />
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
