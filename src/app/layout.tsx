import type { Metadata } from "next";
import { Permanent_Marker } from "next/font/google";
import "./globals.css";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Image Card Drag Interaction",
  description: "A simple drag interaction with images using Framer Motion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={permanentMarker.className}>{children}</body>
    </html>
  );
}
