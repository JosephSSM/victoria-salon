import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta | Victoria Salón",
  description: "Área de clientas de Victoria Salón: gestiona tus citas, reserva nuevos servicios y consulta tu perfil.",
};

export default function MiCuentaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
