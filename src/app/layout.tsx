import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import Header from "@/components/Header";
import { Providers } from "./Provider";
import SocketProvider from "@/components/SocketProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link Up Live",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <SocketProvider>
            <Header />
            {children}
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
