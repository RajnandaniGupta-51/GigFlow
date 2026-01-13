import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-[100] border-b border-white/5 bg-[#050607]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        <div className="flex items-center gap-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="text-2xl font-bold tracking-tighter uppercase italic text-white cursor-pointer group select-none" 
            onClick={() => navigate("/")}
          >
            Gig
            <span className="text-emerald-500 group-hover:text-white transition-colors duration-500">
              Flow
            </span>
            .
          </motion.div>


          <div className="hidden sm:flex items-center gap-3 border-l border-white/10 pl-10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.4em]">
              Marketplace_Live
            </span>
          </div>
        </div>

  
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-white/10 hidden md:block" />
          <span className="text-[10px] font-mono text-gray-700 hidden md:block">
            {new Date().getFullYear()} // GIG_ENGINE
          </span>
        </div>

      </div>

    
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent origin-left"
      />
    </nav>
  );
}
