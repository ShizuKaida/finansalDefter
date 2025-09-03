// src/components/EditTransactionModal.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EditTransactionModal({ trx, onClose, onUpdate }: any) {
  const [amount, setAmount] = useState(trx.amount);
  const [note, setNote] = useState(trx.note || "");
  const router = useRouter();
  const handleUpdate = async () => {



  const res = await fetch(`/api/transactions/update/${trx._id}`, {
    method: "PUT",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, note }),
    });

    if (res.ok) {
      const updated = await res.json();
      onUpdate(updated.data); 
      onClose(); 

      router.refresh(); // Sayfayı yenile
    } else {
      alert("Güncelleme başarısız.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-bold mb-4 text-black">İşlemi Güncelle</h3>
        <label className="block text-sm text-gray-700 mb-1">Tutar</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-4 text-black"
        />

        <label className="block text-sm text-gray-700 mb-1">Not</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 text-black"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">
            Vazgeç
          </button>
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
