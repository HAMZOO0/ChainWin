"use client";
import { useContractRead, useWriteContract, useChainId } from "wagmi";
// import { sepolia, hardhat } from "viem/chains";
import { formatEther, parseEther } from "viem";
import toast from "react-hot-toast";

const { abi, contractAddress } = require("../../constants/index.js");

export default function LotteryEntrance() {
   const chainId = useChainId(); // here we read the chainid of blockchain network
   const contractAddressForChain = contractAddress[chainId]?.[0]; // Dynamically gets the

   //#1: now we  read the getEntranceFee function
   const {
      data: entranceFee,
      isLoadingFee,
      isErrorFee,
   } = useContractRead({
      address: contractAddressForChain,
      abi: abi,
      functionName: "getEntranceFee",
      //watch false = Only fetches data once when the component loads
      //watch true =  fetches data  when the component loads
      watch: false,
   });

   //#2: write buyTicket function
   const { writeContract, data, isPending, error } = useWriteContract();
   const handleClick = async () => {
      try {
         toast.loading("🎟️ Buying ticket...");

         await writeContract({
            address: contractAddressForChain,
            abi: abi,
            functionName: "buyTicket",
            watch: false,
            enabled: Boolean(entranceFee), // make sure entranceFee is ready
            value: entranceFee,
         });
         toast.dismiss();
         toast.success("✅ Ticket bought!");
      } catch (e) {
         toast.dismiss();
         toast.error("❌ Transaction failed.");
         console.error("Buy ticket error:", e);
      }
   };

   //#3: now we  read the getNumberOfPlayers function
   const {
      data: numerOfPlayers,
      isLoadingPlayer,
      isErrorPlayer,
   } = useContractRead({
      address: contractAddressForChain,
      abi: abi,
      functionName: "getNumberOfPlayers",
      //watch false = Only fetches data once when the component loads
      //watch true =  fetches data  when the component loads
      watch: true,
   });

   //#4 Now we read the getRecentWinner function
   const {
      data: recentWinner,
      isLoadingRecentWinner,
      isErrorRecentWinner,
   } = useContractRead({
      address: contractAddressForChain,
      abi: abi,
      functionName: "getRecentWinner",
      // refetchInterval: 5000, // auto-refresh every 5 seconds
      watch: true,
      // cacheTime: 0, // avoid stale cached data
   });

   console.log("📛 Chain ID:", chainId);
   // console.log("📜 Contract Address:", contractAddressForChain);
   // console.log(
   //    "🧾 ABI Function Names:",
   //    abi.map((fn) => fn?.name || "undefined")
   // );
   console.log("💰 Entrance Fee:", entranceFee?.toString());
   console.log(" Length of players:", numerOfPlayers?.toString());
   console.log("Recent Winner", recentWinner?.toString());

   return (
      <div>
         <h2 className="text-3xl font-bold text-blue-600 hover:text-red-500 transition duration-300">
            🎟️ Lottery Entrance
         </h2>{" "}
         {isLoadingFee ? (
            <p>Loading fee...</p>
         ) : isErrorFee || !entranceFee ? (
            <p>Error fetching entrance fee.</p>
         ) : (
            <p>
               Entrance Fee: <strong>{formatEther(entranceFee)} ETH</strong>
            </p>
         )}
         <button onClick={handleClick} disabled={isPending}>
            {isPending ? "Processing..." : "Enter Lottery"}
         </button>
         <div>
            {isLoadingPlayer ? (
               <p>Loading Player...</p>
            ) : isErrorPlayer ? (
               <p>Error fetching entrance Player.</p>
            ) : (
               <p>
                  Total Number of Players: <strong>{numerOfPlayers} </strong>
               </p>
            )}
         </div>
         <div>
            {isLoadingRecentWinner ? (
               <p>Loading Recent Winner...</p>
            ) : isErrorRecentWinner ? (
               <p>Error fetching Recent Winner.</p>
            ) : (
               <p>
                  Recent Winner is : <strong>{recentWinner} </strong>
               </p>
            )}
         </div>
         {error && <p style={{ color: "red" }}>{error.message}</p>}
      </div>
   );
}
