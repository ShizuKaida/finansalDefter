"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"income" | "expense">("income");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  // Kategorileri API'den çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/admin/category/get", {
          credentials: "include",
        });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Kategori çekme hatası:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  try {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    if (!selectedCategory) {
      alert("Kategori bulunamadı.");
      return;
    }

    const payload = {
      categoryId,
      income: selectedCategory.income,
      categoryType: selectedCategory.type,
      amount: Number(amount),
      note,
      currency: "TRY",
      date: new Date().toISOString(), // örnek tarih
    };

    const res = await fetch("/api/transactions/addTransaction", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Ekleme başarısız");

    alert("✅ İşlem başarıyla eklendi!");
    router.push("/dashboard");
  } catch (err: any) {
    alert("❌ Hata: " + err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">➕ Gelir / Gider Ekle</h2>

        {/* Gelir / Gider seçimi */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              setType("income");
              setCategoryId(""); // kategori sıfırla
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              type === "income" ? "bg-green-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            Gelir
          </button>
          <button
            type="button"
            onClick={() => {
              setType("expense");
              setCategoryId(""); // kategori sıfırla
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              type === "expense" ? "bg-red-500 text-white" : "bg-gray-200 text-black"
            }`}
          >
            Gider
          </button>
        </div>

        {/* Kategori seçimi */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Kategori</label>
          <select
            className="w-full border px-3 py-2 rounded-lg text-black"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Kategori Seç</option>
            {categories
              .filter((cat) => (type === "income" ? cat.income : !cat.income))
              .map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Tutar */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Tutar (₺)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded-lg text-black"
            placeholder="Örn: 1500"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Açıklama (opsiyonel)</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg text-black"
            placeholder="Not ekleyebilirsiniz"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition duration-200"
        >
          {loading ? "Ekleniyor..." : "➕ Kaydet"}
        </button>
      </form>
    </div>
  );
}
