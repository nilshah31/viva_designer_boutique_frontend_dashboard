import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";

export const metadata = {
  title: "Viva Dashboard",
  description: "Admin Panel",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
