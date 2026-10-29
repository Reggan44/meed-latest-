"use client";
import { useEffect, useState } from "react";

const COPY = {
  PAID: { cls: "text-green-600", text: "Payment received. Thank you!" },
  FAILED: { cls: "text-red-600", text: "Payment failed or was cancelled." },
  PENDING: { cls: "text-amber-600", text: "Payment not yet confirmed." },
};

export default function PaymentStatus({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (status === "PAID") return;
    let tries = 0;
    async function check() {
      try {
        const res = await fetch("/api/payments/intasend/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.paymentStatus) setStatus(data.paymentStatus);
        if (data.paymentStatus === "PENDING" && ++tries < 5) timer = setTimeout(check, 4000);
      } catch {}
    }
    let timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [orderId]);

  async function retry() {
    setPaying(true);
    try {
      const res = await fetch("/api/payments/intasend/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPaying(false);
    } catch {
      setPaying(false);
    }
  }

  const { cls, text } = COPY[status] ?? COPY.PENDING;
  return (
    <div className="mt-3">
      <p className={`text-sm font-semibold ${cls}`}>{text}</p>
      {status !== "PAID" && (
        <button
          onClick={retry}
          disabled={paying}
          className="mt-3 px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-60"
        >
          {paying ? "Redirecting..." : "Pay now (M-Pesa / Card)"}
        </button>
      )}
    </div>
  );
}
