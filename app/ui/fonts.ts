import { Inter, Lusitana, Noto_Sans } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const lusitana = Lusitana({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const noto_sans = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-noto_sans",
});
