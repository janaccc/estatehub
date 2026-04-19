"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/supabaseClient";
import { ensureProfile } from "@/lib/supabase/ensureProfile";

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Izpolni vsa polja.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const metadata = data.user.user_metadata;
      const { error: profileError } = await ensureProfile({
        id: data.user.id,
        email: data.user.email,
        fullName: metadata?.name ?? metadata?.full_name ?? null,
      });

      if (profileError) {
        setError(`Prijava je uspela, profil pa ne: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-white">
      <div className="glass-card w-full max-w-md p-8">

        <h1 className="title">Prijava</h1>
        <p className="subtitle">Dostop do EstateHub računa</p>

        <div className="mt-6 flex flex-col gap-4">

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
            onClick={login}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Prijava..." : "Prijava"}
          </button>

          <button
            onClick={() => router.push("/register")}
            className="btn-secondary w-full"
          >
            Ustvari račun
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

        </div>
      </div>
    </div>
  );
}
