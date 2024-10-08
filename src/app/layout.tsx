import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import Header from "@/components/Header";
import { Providers } from "./Provider";
// import SocketProvider from "@/components/SocketProvider";
// import PeerProvider from "@/components/PeerProvider";

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
      <body className={`${inter.className} bg-[#FAFAFA]`} suppressHydrationWarning={true}>
        <Providers>
          {/* <SocketProvider> */}
            {/* <PeerProvider> */}
              <Header />
              {children}
            {/* </PeerProvider> */}
          {/* </SocketProvider> */}
        </Providers>
      </body>
    </html>
  );
}
