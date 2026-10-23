"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WeeklySalesChart({ sales = [] }) {
  const options = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: "top" } },
  };
  // Last 7 days, oldest first
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const labels = days.map((d) =>
    d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
  );
  const salesOn = (d) =>
    sales.filter(
      (sale) => new Date(sale.createdAt).toDateString() === d.toDateString()
    );
  const revenueByDay = days.map((d) =>
    salesOn(d).reduce((acc, sale) => acc + (sale.total ?? 0), 0)
  );
  const ordersByDay = days.map(
    (d) => new Set(salesOn(d).map((sale) => sale.orderId)).size
  );
  const tabs = [
    {
      title: "Sales",
      type: "sales",
      data: {
        labels,
        datasets: [
          {
            label: "Sales (Ksh)",
            data: revenueByDay,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      },
    },
    {
      title: "Orders",
      type: "orders",
      data: {
        labels,
        datasets: [
          {
            label: "Orders",
            data: ordersByDay,
            borderColor: "rgb(0, 137, 132)",
            backgroundColor: "rgba(0, 137, 132, 0.5)",
          },
        ],
      },
    },
  ];
  const [chartTodDisplay, setChatTodDisplay] = useState(tabs[0].type);
  return (
    <div className="dark:bg-slate-700 bg-slate-50 p-8 rounded-lg shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-50">
        Weekly Sales
      </h2>
      <div className="p-4">
        {/* Tabs */}

        <div className="text-sm font-medium text-center text-gray-200 border-b border-gray-400 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            {tabs.map((tab, i) => {
              return (
                <li className="me-2" key={i}>
                  <button
                    onClick={() => setChatTodDisplay(tab.type)}
                    className={
                      chartTodDisplay == tab.type
                        ? "inline-block p-4 text-orange-600 border-b-2 border-orange-600 rounded-t-lg active dark:text-orange-500 dark:border-orange-500"
                        : "inline-block p-4 border-b-2 border-transparent rounded-t-lg  text-slate-500 hover:text-orange-600 hover:border-gray-100 dark:hover:text-gray-100"
                    }
                  >
                    {tab.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content to display */}
        {tabs.map((tab, i) => {
          if (chartTodDisplay === tab.type) {
            return <Line key={tab.type} options={options} data={tab.data} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
