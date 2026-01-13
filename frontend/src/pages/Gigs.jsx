import { Link } from "react-router-dom";
import { useGigs } from "../context/GigContext";
import { motion } from "framer-motion";

export default function Gigs() {
  const { gigs } = useGigs();

  return (
    <div className="min-h-screen bg-[#050607] pt-32 px-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-bold">Open_Market_Opportunities</h2>
          <div className="h-px flex-grow bg-white/5" />
          <span className="text-[10px] font-mono text-emerald-500">{gigs.length} ACTIVE_STREAMS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {gigs.map((gig, i) => (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={gig._id}
            >
              <Link 
                to={`/gigs/${gig._id}`}
                className="group relative block bg-[#08090a] p-10 hover:bg-[#0c0d0e] transition-colors h-full border-white/5"
              >
                <span className="text-[8px] font-mono text-gray-600 absolute top-6 left-6 italic">#{i + 101}</span>
                <h3 className="text-xl font-bold tracking-tighter text-white mb-4 uppercase group-hover:text-emerald-500 transition-colors">
                  {gig.title}
                </h3>
                <div className="flex justify-between items-end mt-12">
                   <div>
                      <p className="text-[8px] uppercase tracking-widest text-gray-500 mb-1">Reward_Pool</p>
                      <p className="text-xl font-mono text-white">₹{gig.budget}</p>
                   </div>
                   <div className="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                      <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}