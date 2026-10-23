import "../styles/main.scss";
import Providers from "@/context/Providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meed Ecommerce",
  description: "Shop fashion and more from trusted Kenyan sellers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans">
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>{children}</Providers>
        {/* { {children} } */}
      </body>
    </html>
  );
}
