// app/layout.jsx
"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../lib/wagmi.js";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
   return (
      <html>
         <body>
            <WagmiProvider config={config}>
               <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider>{children}</RainbowKitProvider>
               </QueryClientProvider>
            </WagmiProvider>
         </body>
      </html>
   );
}
