"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);
const COLORS = [
  "rgba(0, 0, 255, 0.7)",
  "rgba(255, 0, 221, 0.7)",
  "rgba(2, 139, 71, 0.7)",
  "rgba(234, 138, 0, 0.7)",
  "rgba(0, 0, 0, 0.7)",
];

export default function BestSellingProductsChart({ sales = [] }) {
  const totals = {};
  sales.forEach((sale) => {
    const key = sale.productTitle ?? "Unknown";
    totals[key] = (totals[key] ?? 0) + (sale.productQty ?? 0);
  });
  const top = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const data = {
    labels: top.map(([title]) => title),
    datasets: [
      {
        label: "Units sold",
        data: top.map(([, qty]) => qty),
        backgroundColor: COLORS,
        borderColor: COLORS,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="dark:bg-slate-700 bg-slate-50 p-8 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Best Selling Charts
      </h2>
      {/* Chart */}
      <div className="p-4">
        {top.length > 0 ? (
          <Pie data={data} />
        ) : (
          <p className="text-slate-500 dark:text-slate-300">
            No sales yet. Top products will appear here after the first sale.
          </p>
        )}
      </div>
    </div>
  );
}
