import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexor — Portal de Socios",
  description: "Ecosistema de Partners de Nexor. Landing Page pública para captación de embajadores y Portal Privado de habilitación de ventas con CRM local, recursos e IA Sales Coach.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased text-gray-900 bg-[#f8fafc]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
