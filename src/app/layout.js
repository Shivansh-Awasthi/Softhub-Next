import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from './components/HeaderWrapper';
import SidebarWrapper from './components/Sidebar/SidebarWrapper';

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
        <div className="flex min-h-screen">
          <SidebarWrapper />
          <div className="flex-1 md:mx-6 transition-all duration-300">
            <div className="container mx-auto px-2">
              <div className="mt-8 mb-4">
                <HeaderWrapper />
              </div>
              <div className="relative ">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
