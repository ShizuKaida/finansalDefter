"use client";

import { useState } from "react";
import EditTransactionModal from "./EditTransaction"; 
import { useRouter } from "next/navigation";

export default function TransactionItem({ trx, category }: any) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Bu işlemi silmek istediğine emin misin?")) return;

    const res = await fetch(`/api/transactions/delete/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh(); 
    } else {
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="bg-white p-4 shadow rounded-lg text-black cursor-pointer hover:bg-gray-100
                   hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      >
        <div className="flex justify-between">
          <span className="font-semibold">{category?.name || "Kategori Bulunamadı"}</span>
          <span className={trx.income ? "text-green-600" : "text-red-600"}>
            {trx.income ? "+" : "-"}₺{trx.amount}
          </span>
        </div>
        {trx.note && <div className="text-sm text-gray-600 mt-1">📝 {trx.note}</div>}
        <div className="text-xs text-gray-400 mt-1">
          {new Date(trx.date).toLocaleString("tr-TR")}
        </div>
      </div>

      {/* Detay Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-black">İşlem Detayları</h3>
            <p className="text-sm text-gray-700 mb-4">
              {category?.name} - {trx.income ? "Gelir" : "Gider"} - ₺{trx.amount}
            </p>
            <p className="text-sm text-gray-600 mb-2">Açıklama: {trx.note || "-"}</p>
            <p className="text-sm text-gray-400 mb-4 text-black">
              Tarih: {new Date(trx.date).toLocaleString("tr-TR")}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Kapat
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDelete(trx._id)}
              >
                Sil
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setOpen(false); // detay modalı kapat
                  setEditOpen(true); // edit modalı aç
                }}
              >
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Güncelleme Modalı */}
      {editOpen && (
        <EditTransactionModal
          trx={trx}
          onClose={() => setEditOpen(false)}
          onUpdate={(updated: any) => {
            // opsiyonel: yukarıya veri yansıtılabilir
            console.log("Güncellendi:", updated);
          }}
        />
      )}
    </>
  );
}
