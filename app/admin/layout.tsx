import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de gestión | Victoria Salón",
  description: "Panel de administración interno de Victoria Salón, Peluquería y Estética.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
