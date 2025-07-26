"use client";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";

export default function HowItWorks() {
   const steps = [
      {
         title: "Connect Your Wallet",
         description:
            "To get started, connect your Web3 wallet (like MetaMask or Coinbase Wallet) by clicking the 'Connect Wallet' button in the navigation bar. This allows you to interact with the lottery smart contract on the blockchain.",
         icon: "🔗",
      },
      {
         title: "Buy a Ticket",
         description:
            "Once your wallet is connected, you can purchase a lottery ticket. The ticket price is set by the smart contract and is displayed on the main page. Clicking the 'BUY TICKETS' button will prompt a transaction in your wallet.",
         icon: "🎟️",
      },
      {
         title: "The Draw",
         description:
            "A provably fair and random winner is chosen using Chainlink VRF (Verifiable Random Function). This ensures that the outcome is tamper-proof and unpredictable.",
         icon: "🎲",
      },
      {
         title: "Claim Your Prize",
         description:
            "If you're the lucky winner, the jackpot prize is automatically transferred to your wallet address. The recent winner is always displayed on the main page.",
         icon: "🏆",
      },
   ];

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
         <NavBar />
         <div className="max-w-4xl mx-auto py-12 px-4">
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className="text-center mb-12"
            >
               <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
                  How ChainWin Works
               </h1>
               <p className="text-lg text-gray-300">
                  A simple guide to participating in our decentralized lottery.
               </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
               {steps.map((step, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.5, delay: index * 0.2 }}
                     className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 flex items-start gap-6"
                  >
                     <div className="text-4xl">{step.icon}</div>
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{step.title}</h2>
                        <p className="text-gray-400">{step.description}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
   );
}
