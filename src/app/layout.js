import { Geist } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "RivalPick",
    template: "%s · RivalPick",
  },
  description: "Plataforma de predicciones de fútbol entre amigos",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}