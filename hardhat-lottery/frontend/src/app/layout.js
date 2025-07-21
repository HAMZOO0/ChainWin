"use client";

import { WagmiProvider } from "wagmi";
import { config } from "../lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
   return (
      <html>
         <body>
            <WagmiProvider config={config}>
               <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </WagmiProvider>
         </body>
      </html>
   );
}
