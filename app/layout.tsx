import type { Metadata } from "next";
import "./globals.css";
import AppTheme from "./theme/AppTheme";

export const metadata: Metadata = {
  title: "Orders",
  description: "Orders management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  );
}
