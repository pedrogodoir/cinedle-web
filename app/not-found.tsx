"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film, Popcorn } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <Film className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
        <h1 className="text-6xl font-bold tracking-widest mb-4">
          404
        </h1>
        <p className="text-lg mb-2">Cena não encontrada!</p>
        <p className="text-gray-400 mb-8 max-w-md">
          Parece que essa parte do roteiro foi cortada na edição...  <br></br>
          Mas você pode voltar ao início e continuar a aventura.
        </p>

        <Link
          href="/"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors px-6 py-3 rounded-full text-lg font-semibold"
        >
          <Popcorn className="w-5 h-5" />
          Voltar ao Início
        </Link>
      </motion.div>

    </div>
  );
};

export default NotFound;
