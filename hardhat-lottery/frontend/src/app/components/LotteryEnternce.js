"use client";
import { useContractRead, useContractWrite, usePrepareContractWrite, useChainId, useReadContract } from "wagmi";
import { sepolia, hardhat } from "viem/chains";
import { formatEther } from "viem";

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

   console.log("Current Chain ID:", chainId);
   console.log("isLoading:", isLoading);
   console.log("isError:", isError);
   console.log("entranceFee:", entranceFee);
   // console.log("abi:", abi);
   console.log("contract address:", contractAddress);

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
      </div>
   );
}
