// lib/wagmiConfig.js
"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
   appName: "My Lottery Dapp",
   projectId: "21d16285404834f540703b1912f52b98", // 🔑 create at https://cloud.walletconnect.com
   chains: [sepolia],
   ssr: true,
});
