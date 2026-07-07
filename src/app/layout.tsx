import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elija F.-U. | Portfolio",
  description:
    "Biotechnology student working on adaptive laboratory evolution and applied microbiology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
