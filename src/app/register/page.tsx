"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız.");

      setSuccess("Kayıt başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">Kayıt Ol</h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <input
            type="text"
            name="name"
            placeholder="Ad Soyad"
            required
            className="form-control px-3 py-2 rounded border border-gray-300 w-full mb-3"
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta"
            required
            className="form-control px-3 py-2 rounded border border-gray-300 w-full mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Şifre"
            required
            className="form-control px-3 py-2 rounded border border-gray-300 w-full mb-3"
          />
          <button
            type="submit"
            className="btn btn-primary w-full py-2"
            disabled={loading}
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-black">
          Hesabın var mı?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Giriş Yap
          </button>
        </div>

        {error && (
          <div className="alert alert-danger mt-4 text-sm py-2 px-3">{error}</div>
        )}
        {success && (
          <div className="alert alert-success mt-4 text-sm py-2 px-3">{success}</div>
        )}
      </div>
    </div>
  );
}
