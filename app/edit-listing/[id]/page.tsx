"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  area: number;
  images: string[];
}

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    area: "",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([null as any]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([""]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState<string>("");

  useEffect(() => {
    fetchListing();
  }, [id]);

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
      setFormData({
        title: data.title,
        description: data.description || "",
        location: data.location,
        price: data.price.toString(),
        area: data.area.toString(),
      });
      setExistingImages(data.images || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImagesArray = [...newImages];
      newImagesArray[index] = file;
      setNewImages(newImagesArray);

      const newPreviews = [...newImagePreviews];
      newPreviews[index] = URL.createObjectURL(file);
      setNewImagePreviews(newPreviews);

      // If this is the last input and a file was added, add a new input
      if (index === newImages.length - 1) {
        setNewImages([...newImagesArray, null as any]);
        setNewImagePreviews([...newPreviews, ""]);
      }
    }
  };

  const removeNewImage = (index: number) => {
    const newImagesArray = newImages.filter((_, i) => i !== index);
    const newPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(newImagesArray);
    setNewImagePreviews(newPreviews);
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

    const uploadedUrls: string[] = [...existingImages];
    const validImages = newImages.filter(img => img !== null);

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
    setUpdating(true);

    const supabase = getSupabase();
    if (!supabase) return;

    const imageUrls = await uploadImages();

    const { error } = await supabase
      .from("listings")
      .update({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        images: imageUrls,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating listing:", error);
      alert("Napaka pri posodabljanju oglasa");
    } else {
      alert("Oglas posodobljen!");
      router.push("/myaccount");
    }

    setUpdating(false);
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
          Uredi oglas
        </div>

        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Uredite svoj oglas
        </h1>

        <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Posodobite podatke oglasa in naložite nove slike po potrebi.
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
            <label className="block text-sm font-medium mb-2">Obstoječe slike</label>
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Slika ${index + 1}`}
                  className="w-full h-20 object-cover rounded cursor-pointer"
                  onClick={() => openModal(image)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Dodaj nove slike</label>
            {newImages.map((_, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(index)}
                  className="flex-1 border p-2 rounded bg-[var(--card)] text-[var(--foreground)]"
                />
                {newImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
                  >
                    Odstrani
                  </button>
                )}
              </div>
            ))}
            {newImagePreviews.filter(p => p).length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {newImagePreviews.filter(p => p).map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Nova slika ${index + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer"
                    onClick={() => openModal(preview)}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-[var(--accent)] text-[#041014] px-6 py-2 rounded hover:bg-[var(--accent-strong)] disabled:opacity-50 cursor-pointer"
          >
            {updating ? "Posodabljanje..." : "Posodobi oglas"}
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