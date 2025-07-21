"use client";

import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "@wagmi/connectors"; // ✅ fix

export const config = createConfig({
   chains: [sepolia],
   connectors: [injected()], // ✅ this must be called
   transports: {
      [sepolia.id]: http(),
   },
   ssr: true,
});
