import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";


export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredRole, setHoveredRole] = useState(null);

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

const handleRoleSelection = (role) => {
  if (user) {
    if (user.role === "client") navigate("/client/dashboard");
    else if (user.role === "freelancer") navigate("/freelancer/dashboard");
    return;
  }

  navigate(`/login?role=${role}`);
};



  return (
    <div className="bg-[#08090a] text-[#e4e4e4] font-sans selection:bg-emerald-500/30 overflow-x-hidden min-h-screen">
    
      <motion.div 
        style={{ y: bgY }}
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
      >
        <div className="absolute inset-0" style={{ 
          backgroundImage: `radial-gradient(circle at 2px 2px, #333 1px, transparent 0)`,
          backgroundSize: '40px 40px' 
        }} />
      </motion.div>


      <main className="relative z-10">
        
<section className="relative pt-40 pb-40 px-8 max-w-7xl mx-auto overflow-hidden min-h-[90vh] flex items-center">

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="relative z-10 grid lg:grid-cols-12 gap-12 items-center w-full"
  >

    <div className="lg:col-span-7">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-8 bg-emerald-500" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-bold">
          GigFlow · Hiring System
        </span>
      </div>

      <h1 className="text-[10vw] md:text-[8vw] font-medium leading-[0.85] tracking-tighter mb-12">
        MODERN <br />
        <span className="text-gray-600 italic font-light">HIRING.</span>
      </h1>

      <p className="text-xl text-gray-400 font-light leading-relaxed max-w-md mb-12">
        A streamlined freelance marketplace where clients post real gigs and skilled
        freelancers compete with <span className="text-white border-b border-emerald-500/50">transparency</span> — not noise.
      </p>

<button
  onClick={() => {
    const target = document.getElementById("features");
    if (target) {
      const offset = 100; 
      const topPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: topPos,
        behavior: "smooth",
      });
    }
  }}
  className="group relative px-12 py-6 bg-emerald-600 text-white font-bold overflow-hidden rounded-sm transition-all hover:bg-emerald-500 uppercase text-xs tracking-[0.2em]"
>
  Explore Marketplace
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

</button>

    </div>

    <div className="lg:col-span-5 relative flex justify-center items-center">

      <div className="relative w-80 h-80 flex items-center justify-center">

        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.5, 1.5] }}
            transition={{ repeat: Infinity, duration: 4, delay: ring * 1.2 }}
            className="absolute inset-0 border border-emerald-500 rounded-full"
          />
        ))}

        <motion.div
          whileHover={{ y: -5 }}
          className="relative z-20 w-64 bg-[#0a0b0c]/80 backdrop-blur-2xl border border-white/10 p-5 rounded-lg shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
              Live_Gig_Match
            </span>
          </div>

          <div className="space-y-3 font-mono">
            {[
              { label: "FREELANCER_ID", val: "DEV_092", color: "text-emerald-500" },
              { label: "SKILLS", val: "REACT_NODE", color: "text-white" },
              { label: "BID_LATENCY", val: "12s", color: "text-emerald-500" },
              { label: "STATUS", val: "AVAILABLE", color: "text-blue-400" },
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                key={i}
                className="flex justify-between items-center"
              >
                <span className="text-[9px] text-gray-600">{item.label}</span>
                <span className={`text-[9px] ${item.color}`}>{item.val}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 h-8 flex items-end gap-1 opacity-50">
            {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${h}%`, `${h - 20}%`, `${h}%`] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                className="flex-1 bg-emerald-500/40"
              />
            ))}
          </div>
        </motion.div>

        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 hidden xl:block">
          <span className="text-[10px] text-gray-500 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
            Active_Gigs
          </span>
        </div>

        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 hidden xl:block">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[20px] font-mono text-white leading-none">3,284</span>
            <span className="text-[8px] text-emerald-500 uppercase tracking-widest">
              Freelancers_Online
            </span>
          </div>
        </div>

      </div>
    </div>
  </motion.div>
</section>


<section id="features"  className="px-8 pb-40 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/5 border border-white/5">


    <div className="md:col-span-4 bg-[#08090a] p-12 hover:bg-[#0c0d0e] transition-colors group">
      <div className="w-10 h-10 border border-emerald-500/30 mb-8 flex items-center justify-center text-emerald-500">
        01
      </div>
      <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">
        Verified Talent Pipeline
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        Every freelancer profile is validated through skill signals, past work, and real engagement metrics — no noise, only capability.
      </p>
    </div>


    <div className="md:col-span-8 bg-[#08090a] p-12 flex items-center justify-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-emerald-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-1000" />
      <div className="relative text-center">
        <div className="text-[120px] font-black opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
          FLOW
        </div>
        <h3 className="text-4xl font-light italic">
          "From posting a gig to starting work — without friction."
        </h3>
      </div>
    </div>

    <div className="md:col-span-6 bg-[#08090a] p-12 border-t border-white/5">
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
            Gig Fulfillment Rate
          </div>
          <div className="text-5xl font-light tracking-tighter text-emerald-500">
            98.6%
          </div>
        </div>
        <div className="h-12 w-32 bg-emerald-900/20 rounded-sm overflow-hidden flex items-end gap-1 p-1">
          {[4, 7, 5, 8, 9, 6, 10].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h * 10}%` }}
              className="flex-1 bg-emerald-500/50"
            />
          ))}
        </div>
      </div>
    </div>

    <div className="md:col-span-6 bg-[#08090a] p-12 border-l border-t border-white/5">
      <h3 className="text-xl font-bold uppercase mb-4">
        Role-Based Workflows
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        Clients manage gigs and responses, freelancers discover work and submit bids — each role sees exactly what matters.
      </p>
    </div>

  </div>
</section>

        <section className="pb-60 px-8 max-w-7xl mx-auto">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-gray-500 text-center mb-12">Select Interface Pathway</h2>
          
          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            
    
            <div 
              onMouseEnter={() => setHoveredRole('client')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleRoleSelection('client')}
              className="relative bg-[#08090a] p-16 md:p-24 group cursor-pointer overflow-hidden transition-all duration-700"
            >
              <div className={`absolute inset-0 bg-emerald-600 transition-transform duration-700 ease-[0.22, 1, 0.36, 1] ${hoveredRole === 'client' ? 'translate-y-0' : 'translate-y-[102%]'}`} />
              <div className="relative z-10">
                <h3 className="text-4xl font-bold uppercase tracking-tighter mb-6">I'm a Client</h3>
                <ul className="text-gray-500 space-y-2 mb-10 text-sm transition-colors duration-500 group-hover:text-white/80">
                  <li>• Create and manage gigs</li>
                  <li>• View freelancer responses</li>
                  <li>• Hire the best candidate</li>
                </ul>
                <button className={`py-4 px-8 border transition-all duration-500 uppercase text-[10px] tracking-widest font-bold ${hoveredRole === 'client' ? 'bg-white text-black border-white' : 'border-white/10 text-white'}`}>
                  Continue as Client →
                </button>
              </div>
            </div>

    
            <div 
              onMouseEnter={() => setHoveredRole('freelancer')}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleRoleSelection('freelancer')}
              className="relative bg-[#08090a] p-16 md:p-24 group cursor-pointer overflow-hidden transition-all duration-700"
            >
              <div className={`absolute inset-0 bg-emerald-600 transition-transform duration-700 ease-[0.22, 1, 0.36, 1] ${hoveredRole === 'freelancer' ? 'translate-y-0' : 'translate-y-[102%]'}`} />
              <div className="relative z-10">
                <h3 className="text-4xl font-bold uppercase tracking-tighter mb-6">I'm a Freelancer</h3>
                <ul className="text-gray-500 space-y-2 mb-10 text-sm transition-colors duration-500 group-hover:text-white/80">
                  <li>• Browse open gigs</li>
                  <li>• Submit competitive bids</li>
                  <li>• Get hired faster</li>
                </ul>
                <button className={`py-4 px-8 border transition-all duration-500 uppercase text-[10px] tracking-widest font-bold ${hoveredRole === 'freelancer' ? 'bg-white text-black border-white' : 'border-white/10 text-white'}`}>
                  Continue as Freelancer →
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-[10px] uppercase tracking-[0.5em] text-gray-600">
          Designed & built as a full-stack freelance marketplace project 🚀
        </div>
      </footer>
    </div>
  );
}