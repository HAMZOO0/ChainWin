"use client";
import { motion } from "framer-motion";
import { Check, Gavel, Shield, Star } from "lucide-react";

const TermCard = ({ icon, title, items, delay }) => (
   <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-lg"
   >
      <div className="flex items-center mb-4">
         <div className="p-2 bg-purple-600 rounded-full mr-4">{icon}</div>
         <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <ul className="space-y-3 text-gray-300">
         {items.map((item, i) => (
            <li key={i} className="flex items-start">
               <Check size={18} className="text-green-400 mr-3 mt-1 flex-shrink-0" />
               <span className="text-gray-200">{item}</span>
            </li>
         ))}
      </ul>
   </motion.div>
);

export default function TermsAndConditions() {
   const terms = [
      {
         icon: <Gavel size={24} className="text-white" />,
         title: "1. Eligibility",
         items: [
            "Participants must be at least 18 years old.",
            "Must comply with all local gambling laws and regulations.",
            "Employees of LottChain and their relatives are not eligible.",
         ],
      },
      {
         icon: <Star size={24} className="text-white" />,
         title: "2. How to Play",
         items: [
            "Each ticket costs exactly the current entrance fee in ETH.",
            "One ticket gives you one entry into the current draw.",
            "Ticket purchases are final and non-refundable.",
         ],
      },
      {
         icon: <Shield size={24} className="text-white" />,
         title: "3. Prize Structure",
         items: [
            "100-99% of the pot goes to the grand prize winner.",
            "0.1-1% is Blockchain Fee.",
            "0-0.1% is kept as a platform maintenance fee.",
         ],
      },
   ];

   return (
      <div className="min-h-screen bg-gray-900">
         <motion.div
            className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
         >
            <motion.h1
               className="text-4xl sm:text-5xl font-bold text-center mb-12 text-white"
               initial={{ y: -30, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.1, type: "spring" }}
            >
               Terms and Conditions
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {terms.map((term, i) => (
                  <TermCard key={i} {...term} delay={0.2 + i * 0.1} />
               ))}
            </div>

            <motion.div
               className="mt-16 p-6 bg-gray-800 rounded-xl border border-gray-700 text-center"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.8 }}
            >
               <p className="text-gray-300 text-lg font-medium">
                  By participating, you agree to these terms. Happy playing!
               </p>
            </motion.div>
         </motion.div>
      </div>
   );
}
