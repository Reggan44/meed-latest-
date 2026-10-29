import Image from "next/image";
import Link from "next/link";
import logo from "../../public/Logo.png";

const links = [
  {
    title: "Shop",
    items: [
      { label: "All products", href: "/search" },
      { label: "Cart", href: "/cart" },
      { label: "My orders", href: "/dashboard/orders" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "Support & FAQ", href: "/support" },
      { label: "Create an account", href: "/register" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Sellers",
    items: [
      { label: "Sell on Meed", href: "/sell" },
      { label: "Seller login", href: "/login" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-10 sm:pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Image className="h-9 w-auto" src={logo} alt="Meed Collections" />
            <p className="mt-5 text-sm leading-relaxed text-gray-600">
              Meed Collections: fashion delivered across Kenya. Pay securely
              with M-Pesa or card.
            </p>
          </div>
          {links.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-gray-900">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="mt-10 border-gray-200" />
        <p className="mt-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Meed Collections. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
