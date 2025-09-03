"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ router için
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#F94144"];

// Özel label (₺ ekli)
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight={600}
    >
      {value} ₺
    </text>
  );
};

export default function DashboardPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [totals, setTotals] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user/expenses", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Yetkisiz veya hata oluştu");

        const data = await res.json();
        setExpenses(data.expenses || []);
        setIncomes(data.incomes || []);
        setTotals(data.total || []);
      } catch (err: any) {
        console.error("Hata:", err.message);
      }
    };

    fetchData();
  }, []);

  const renderChart = (data: any[], title: string, emoji: string) => (
    <div className="bg-white shadow-md rounded-xl p-4 w-full sm:w-[300px] flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">{emoji} {title}</h2>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={renderCustomLabel}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-6">
      {/* --- BUTTONS --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={() => router.push("/transactions")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-all duration-200"
        >
          📄 Hesap Hareketlerini Görüntüle
        </button>
        <button
          onClick={() => router.push("/addTransaction")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow transition-all duration-200"
        >
          ➕ Gelir / Gider Ekle
        </button>
      </div>

      {/* --- HEADER --- */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-black">
        📊 Finansal Dağılım
      </h1>

      {/* --- CHARTS --- */}
      <div className="flex flex-wrap justify-center gap-6 text-black">
        {renderChart(incomes, "Gelirler", "💰")}
        {renderChart(expenses, "Giderler", "💸")}
        {totals.length > 0 ? (
          renderChart(totals, "Gelir vs Gider", "💼")
        ) : (
          <div className="w-full sm:w-[300px] bg-white shadow-md rounded-xl p-4 text-center text-gray-500">
            Yükleniyor veya veri yok...
          </div>
        )}
      </div>
    </div>
  );
}
