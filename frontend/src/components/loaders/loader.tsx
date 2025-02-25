import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#09090B] text-white">
      {/* Spinning loader */}
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Loading text */}
      <motion.p
        className="mt-4 text-lg font-medium text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        Setting up your event...
      </motion.p>
    </div>
  );
};

export default Loader;

