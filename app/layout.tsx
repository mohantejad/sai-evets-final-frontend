import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/component/ClientProvider";
import ClientHeader from "@/component/ClientHeader";
import Footer from "@/component/Footer";


export const metadata: Metadata = {
  title: "Sai Events",
  description: "A Personal Project for IT project subject",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ClientProvider>
          <ClientHeader />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
