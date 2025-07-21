"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Header() {
   const { address, isConnected } = useAccount();
   const { connect, connectors, isPending, error } = useConnect();
   const { disconnect } = useDisconnect();

   return (
      <div>
         <h2>🎰 Lottery Project</h2>

         {isConnected ? (
            <>
               <p>Connected Wallet: {address}</p>
               <button onClick={() => disconnect()}>Disconnect</button>
            </>
         ) : (
            <>
               <button onClick={() => connect({ connector: connectors[0] })} disabled={isPending}>
                  {isPending ? "Connecting..." : "Connect Wallet"}
               </button>
               {error && <p style={{ color: "red" }}>{error.message}</p>}
            </>
         )}
      </div>
   );
}
