// app/components/NavBar.jsx or page.jsx
"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
   return (
      <div>
         <h2>🎰 Lottery DApp</h2>
         <ConnectButton />
      </div>
   );
}
