"use client";
import { useContractRead, useWriteContract, useChainId, waitForTransactionReceipt } from "wagmi";
import { sepolia, hardhat } from "viem/chains";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";

const { abi, contractAddress } = require("../../constants/index.js");

export default function LotteryEntrance() {
   const chainId = useChainId(); // here we read the chainid of blockchai network
   const contractAddressForChain = contractAddress[chainId]?.[0]; // Dynamically gets the address
   // now we  read the entrance fee
   const {
      data: entranceFee,
      isLoading,
      isError,
   } = useContractRead({
      address: contractAddressForChain,
      abi: abi,
      functionName: "getEntranceFee",
      watch: true,
   });

   const { writeContract, data, isPending, error } = useWriteContract();

   const handleClick = async () => {
      try {
         toast.loading("🎟️ Buying ticket...");

         const tx = writeContract({
            address: contractAddressForChain,
            abi: abi,
            functionName: "buyTicket",
            watch: false,
            enabled: Boolean(entranceFee), // make sure entranceFee is ready
            value: BigInt(entranceFee),
         });
         toast.dismiss();
         toast.loading("⛓️ Waiting for transaction confirmation...");

         // Wait for confirmation
         const receipt = await waitForTransactionReceipt({ tx });
         toast.dismiss();
         toast.success("✅ Ticket bought successfully!");
         console.log("receipt ==>", receipt);
      } catch (e) {
         toast.dismiss();
         toast.error("❌ Transaction failed.");
         console.error("Buy ticket error:", e);
      }
   };

   console.log("📛 Chain ID:", chainId);
   console.log("📜 Contract Address:", contractAddressForChain);
   console.log(
      "🧾 ABI Function Names:",
      abi.map((fn) => fn?.name || "undefined")
   );
   console.log("💰 Entrance Fee:", entranceFee?.toString());

   return (
      <div>
         <h2 className="text-lg font-semibold">🎟️ Lottery Entrance</h2>
         {isLoading ? (
            <p>Loading fee...</p>
         ) : isError ? (
            <p>Error fetching entrance fee.</p>
         ) : (
            <p>
               Entrance Fee: <strong>{formatEther(entranceFee)} ETH</strong>
            </p>
         )}

         <button onClick={handleClick} disabled={isPending}>
            {isPending ? "Processing..." : "Enter Lottery"}
         </button>
         {error && <p style={{ color: "red" }}>{error.message}</p>}
      </div>
   );
}
