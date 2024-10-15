import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Link Up Live",
};

export default function MeetingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FAFAFA]`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
