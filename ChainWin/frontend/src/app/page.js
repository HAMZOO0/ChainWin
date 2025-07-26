import NavBar from "./components/NavBar"; // Update this import name
import LotteryEntrance from "./components/LotteryEnternce";
import Link from "next/link";

export default function Home() {
   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
         {/* Add the new NavBar at the very top */}
         <NavBar /> {/* This replaces your <Header /> component */}
         {/* Main content container */}
         <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 flex flex-col items-center">
            {/* Project title */}

            {/* Remove the old Header component placement here */}

            {/* LotteryEntrance */}
            <div className="w-full max-w-4xl">
               <LotteryEntrance />
            </div>

            {/* Terms and Conditions Button */}
            <div className="mt-8">
               <Link href="/terms-and-conditions">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                     Terms & Conditions
                  </button>
               </Link>
            </div>
         </div>
      </div>
   );
}
