import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ParallaxBackground from "@/app/components/ParallaxBackground";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EstateHub",
  description: "Nepremičnine brez posrednikov",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sl">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} antialiased bg-[#0b0f14] text-white`}
      >
        <ParallaxBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}