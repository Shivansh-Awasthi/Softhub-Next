import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from './components/HeaderWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ToxicGames - Download Free Games and Software",
  description: "Download free games and software for Mac, PC, Android, PS2, PS3, PS4, and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <div className="min-h-screen">
          <div className="container mx-auto p-2">
            <div className="mb-4">
              <HeaderWrapper />
            </div>
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
