import Header from "@/app/components/places/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "Emmanuel E-commerce",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
