const faqs = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, go to checkout, enter your delivery details and pay online.",
  },
  {
    q: "How can I pay?",
    a: "Payment is online only, with M-Pesa or card, in Kenyan Shillings (KSh). We do not offer cash on delivery.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery takes 1 to 3 working days depending on the shipping option you choose at checkout.",
  },
  {
    q: "My payment did not go through. What now?",
    a: "Open your order from My orders and use the Pay now button to try again. If money was deducted, it will be confirmed on your order automatically.",
  },
  {
    q: "How do I sell on Meed?",
    a: "Apply on the Sell on Meed page. Meed reviews each application, and once approved you can log in and list products.",
  },
];

export default function Support() {
  return (
    <section className="mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-bold">Support Center</h1>
      <p className="mt-1 text-gray-600">Answers to common questions.</p>
      <div className="mt-6 divide-y rounded-md border">
        {faqs.map((f) => (
          <details key={f.q} className="group p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
