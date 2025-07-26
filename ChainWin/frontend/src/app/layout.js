// app/layout.jsx
"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../lib/wagmi.js";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
   return (
      <html>
         <body>
            {/* ✅ Add Tailwind CDN here */}
            <script src="https://cdn.tailwindcss.com"></script>
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
