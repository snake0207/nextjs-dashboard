import "@/app/ui/global.css";
import { inter, noto_sans } from "@/app/ui/fonts";
// import localFont from "next/font/local";
import { Metadata } from "next";
import ThemeProvider from "@/app/ui/theme-providers";
// import { ThemeProvider } from "next-themes";

// const myFont = localFont({ src: "./ui/fa-regular-400.woff2" });

export const metadata: Metadata = {
  title: {
    template: "%s | Acrofuture Dashboard",
    default: "Home | Acrofuture Dashboard",
  },
  description: "The official Next.js Course Dashboard, built with App Router.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${noto_sans.className}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
