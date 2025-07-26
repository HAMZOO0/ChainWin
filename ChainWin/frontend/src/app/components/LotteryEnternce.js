"use client";
import { useContractRead, useWriteContract, useChainId } from "wagmi";
import { formatEther } from "viem";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const { abi, contractAddress } = require("../../constants/index.js");

export default function LotteryEntrance() {
   const chainId = useChainId();
   const contractAddressForChain = contractAddress[chainId]?.[0];

   // Contract reads
   const {
      data: entranceFee,
      isLoading: isLoadingFee,
      isError: isErrorFee,
   } = useContractRead({
      address: contractAddressForChain,
      abi,
      functionName: "getEntranceFee",
      watch: false,
   });

   const {
      data: numerOfPlayers,
      isLoading: isLoadingPlayer,
      isError: isErrorPlayer,
   } = useContractRead({
      address: contractAddressForChain,
      abi,
      functionName: "getNumberOfPlayers",
      watch: true,
   });

   const {
      data: recentWinner,
      isLoading: isLoadingRecentWinner,
      isError: isErrorRecentWinner,
   } = useContractRead({
      address: contractAddressForChain,
      abi,
      functionName: "getRecentWinner",
      watch: true,
   });

   const { writeContract, isPending, error } = useWriteContract();
   console.log("Entrece fee::", entranceFee);

   const handleClick = async () => {
      try {
         toast.loading("🎟️ Buying ticket...", {
            style: {
               background: "#1F2937",
               color: "#fff",
               border: "1px solid #374151",
            },
         });
         await writeContract({
            address: contractAddressForChain,
            abi,
            functionName: "buyTicket",
            value: entranceFee,
         });
         toast.dismiss();
         toast.success("✅ Ticket bought!", {
            style: {
               background: "#1F2937",
               color: "#fff",
               border: "1px solid #374151",
            },
         });
      } catch (e) {
         toast.dismiss();
         toast.error("❌ Transaction failed.", {
            style: {
               background: "#1F2937",
               color: "#fff",
               border: "1px solid #374151",
            },
         });
         console.error("Buy ticket error:", e);
      }
   };

   // Calculate jackpot
   const jackpotBigInt = entranceFee && numerOfPlayers ? entranceFee * BigInt(numerOfPlayers) : BigInt(0);
   const jackpot = formatEther(jackpotBigInt);
   const prizeTiers = [
      { odds: "1/10", amount: "0.1 ETH", tickets: "10 tickets" },
      { odds: "1/100", amount: "1.0 ETH", tickets: "100 tickets" },
      { odds: "1/1000", amount: "10 ETH", tickets: "1000 tickets" },
   ];

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 flex flex-col items-center">
         {/* Animated Header Section */}
         <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mb-8 text-center"
         >
            <motion.h1
               className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               transition={{
                  duration: 0.5,
                  delay: 0.2,
               }}
            >
               ChainWin Lottery
            </motion.h1>

            <motion.div
               className="flex justify-center"
               whileHover={{ scale: 1.05 }}
               transition={{ type: "spring", stiffness: 300 }}
            >
               <div className="bg-yellow-500/20 border border-yellow-400/50 px-6 py-3 rounded-full">
                  <motion.span
                     className="text-yellow-300 font-bold text-xl"
                     animate={{
                        textShadow: [
                           "0 0 8px rgba(253, 230, 138, 0)",
                           "0 0 8px rgba(253, 230, 138, 0.5)",
                           "0 0 8px rgba(253, 230, 138, 0)",
                        ],
                     }}
                     transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                     }}
                  >
                     Jackpot 💰 {jackpot} ETH
                  </motion.span>
               </div>
            </motion.div>
         </motion.div>

         {/* Main Content */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-md space-y-6"
         >
            {/* Raffle Prizes */}
            <motion.div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg" whileHover={{ y: -5 }}>
               <h2 className="text-2xl font-bold text-white mb-4">Raffle Prizes</h2>
               <div className="space-y-3">
                  {prizeTiers.map((prize, index) => (
                     <motion.div
                        key={index}
                        className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg border border-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                     >
                        <span className="text-white font-medium">{prize.odds}</span>
                        <span className="text-yellow-400 font-bold">{prize.amount}</span>
                        <span className="text-gray-400 text-sm">{prize.tickets}</span>
                     </motion.div>
                  ))}
               </div>
               <motion.p
                  className="text-gray-400 text-sm mt-4 italic text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
               >
                  More tickets sold per draw, more prizes to win
               </motion.p>
            </motion.div>

            {/* Buy Tickets Button */}
            <motion.button
               onClick={handleClick}
               disabled={isPending || !entranceFee}
               initial={{ scale: 0.95 }}
               animate={{ scale: 1 }}
               whileHover={
                  !isPending && entranceFee
                     ? {
                          scale: 1.05,
                          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.3)",
                       }
                     : {}
               }
               whileTap={!isPending && entranceFee ? { scale: 0.98 } : {}}
               className={`w-full py-4 rounded-xl font-bold text-white text-lg ${
                  isPending || !entranceFee
                     ? "bg-gray-600 cursor-not-allowed"
                     : "bg-gradient-to-r from-purple-600 to-blue-600"
               }`}
            >
               {isPending ? (
                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                     Processing...
                  </motion.span>
               ) : (
                  "BUY TICKETS"
               )}
            </motion.button>

            {/* Draws Info */}
            <motion.div
               className="bg-gray-800 border border-gray-700 rounded-xl p-4"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
            >
               <h3 className="text-white font-semibold mb-1">Draws</h3>
               <p className="text-gray-400">Numbers Revealed Once Triggered</p>
            </motion.div>

            {/* Contract Data */}
            <motion.div
               className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.9 }}
            >
               {/* Ticket Price */}
               <div>
                  {isLoadingFee ? (
                     <motion.div
                        className="h-6 w-3/4 bg-gray-700 rounded"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                     />
                  ) : isErrorFee || !entranceFee ? (
                     <p className="text-red-400">Error loading ticket price</p>
                  ) : (
                     <p className="text-gray-300">
                        Ticket Price: <span className="text-purple-400 font-bold">{formatEther(entranceFee)} ETH</span>
                     </p>
                  )}
               </div>

               {/* Tickets Sold */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  {/* Tickets Sold Box */}
                  <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-700">
                     <h2 className="text-xl font-bold mb-2"> Tickets Sold</h2>
                     <p className="text-3xl font-semibold text-green-400">{numerOfPlayers}</p>
                  </div>

                  {/* Recent Winner Box */}
                  <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg border border-gray-700">
                     <h2 className="text-xl font-bold mb-2">🏆 Recent Winner</h2>
                     <p className="text-sm text-gray-300 break-words">{recentWinner || "No winner yet"}</p>
                  </div>
               </div>

               {/* Error Message */}
               {error && (
                  <motion.div
                     className="text-red-400 text-sm bg-red-900/30 p-2 rounded"
                     initial={{ scale: 0.9 }}
                     animate={{ scale: 1 }}
                  >
                     {error.message}
                  </motion.div>
               )}
            </motion.div>
         </motion.div>
      </div>
   );
}
