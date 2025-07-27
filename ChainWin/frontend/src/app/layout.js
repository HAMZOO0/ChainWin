// app/layout.jsx
"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../lib/wagmi.js";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
   return (
      <html>
         <head>
            {/* fav icon is this */}
            <link rel="icon" href="/fav.png" />
         </head>
         <body>
            {/* ✅ Add Tailwind CDN here */}
            <Script src="https://cdn.tailwindcss.com"></Script>
            <WagmiProvider config={config}>
               <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider>
                     {children}
                     <Toaster position="top-center" />
                  </RainbowKitProvider>
               </QueryClientProvider>
            </WagmiProvider>
         </body>
      </html>
   );
}
