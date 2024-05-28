import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import Provider from "@/components/provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChatPDF",
  description: "Chat with your pdf with the power of AI",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
  );
}
