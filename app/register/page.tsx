"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = getSupabase();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Izpolni vsa polja.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Račun ustvarjen! Preveri email za potrditev.");
    setLoading(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="glass-card w-full max-w-md p-8">

        <h1 className="title">Registracija</h1>
        <p className="subtitle">Ustvari nov račun</p>

        <div className="mt-6 flex flex-col gap-4">

          <input
            placeholder="Ime"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Geslo"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={register}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Ustvarjanje..." : "Ustvari račun"}
          </button>

          <button
            onClick={() => router.push("/login")}
            className="btn-secondary w-full"
          >
            Že imaš račun?
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

        </div>
      </div>
    </div>
  );
}