"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NavBar() {
   return (
      <nav className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Branding */}
            <div className="flex items-center gap-3">
               <motion.div whileHover={{ rotate: 15 }} className="text-3xl">
                  🎰
               </motion.div>
               <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  ChainWin
               </h1>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
               <NavLink href="https://personal-portfolio-phi-mocha.vercel.app/" text="Developer" />
               <NavLink href="https://github.com/your-repo" text="GitHub" />
               <NavLink href="/how-it-works" text="How It Works" />
               <NavLink href="https://docs.chain.link/" text="Chainlink Docs" />
               

               {/* Enhanced Connect Button */}
               <div className="ml-2 ">
                  <ConnectButton
                     accountStatus={{
                        smallScreen: "avatar",
                        largeScreen: "full",
                     }}
                     chainStatus={{
                        smallScreen: "icon",
                        largeScreen: "full",
                     }}
                     showBalance={false}
                     label="Connect Wallet"
                  />
               </div>
            </div>
         </div>
      </nav>
   );
}

function NavLink({ href, text }) {
   return (
      <Link href={href} target="_blank" rel="noopener noreferrer">
         <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-gray-300 hover:text-white transition-colors font-medium"
         >
            {text}
         </motion.div>
      </Link>
   );
}
