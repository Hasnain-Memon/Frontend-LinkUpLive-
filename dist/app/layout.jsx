import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
var inter = Inter({ subsets: ["latin"] });
export var metadata = {
    title: "Link Up Live",
};
export default function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>);
}
