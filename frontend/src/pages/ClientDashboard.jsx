import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import CreateGigForm from "./CreateGigForm";
import ClientGigCard from "./ClientGigCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ClientDashboard() {
  const [allGigs, setAllGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();


  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const fetchGigs = async (query = "") => {
    try {
      const url = query ? `/gigs?search=${query}` : "/gigs";
      const res = await api.get(url);

      const data = Array.isArray(res.data) ? res.data : (res.data.gigs || []);
      setAllGigs(data);

      console.log("Gigs synced:", data.length);
    } catch (err) {
      console.error("FETCH_GIGS_ERROR:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  useEffect(() => {
    if (!search) return;

    const delayDebounceFn = setTimeout(() => {
      fetchGigs(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#050607] text-[#e4e4e4] font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #333 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full border-x border-white/5 z-0 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-24 space-y-32">

        <header className="relative pt-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-emerald-500" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-bold">
                Protocol Dashboard v2.1.0
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-red-500 transition-colors font-mono"
            >
              [ Terminate_Session ]
            </button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-[7vw] md:text-[5vw] font-medium leading-[0.8] tracking-tighter">
                {user?.name?.toUpperCase() || "CLIENT"} <br />
                <span className="italic font-light text-gray-600">CONTROL.</span>
              </h1>

              <p className="text-gray-500 max-w-md text-sm uppercase tracking-widest leading-relaxed">
                Evaluating network interest and scaling workload through automated gig fulfillment.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5 border border-white/5 backdrop-blur-md">
              <HUDStat label="Active_Nodes" value={allGigs.filter(gig => gig.status !== "assigned").length} />

              <HUDStat label="System_Reach" value="Global" />
              <HUDStat label="Match_Latency" value="14ms" color="text-emerald-500" />
            </div>
          </div>
        </header>


        <section className="sticky top-10 z-30 group">
          <div className="bg-[#0a0b0c]/80 backdrop-blur-2xl border border-white/10 p-2 flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="EXECUTE_SEARCH_QUERY..."
                className="w-full bg-white/[0.03] border border-white/5 px-8 py-5 text-xs font-mono tracking-widest uppercase focus:outline-none focus:border-emerald-500/50 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-mono">
                CMD+K
              </span>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-[0.3em] px-10 py-5 transition-all flex items-center justify-center gap-3"
            >
              {isFormOpen ? "[ CLOSE_TERMINAL ]" : "[ INITIALIZE_NEW_GIG ]"}
            </button>
          </div>

          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-[#0a0b0c] border-x border-b border-white/10"
              >
                <div className="p-12">
                  <CreateGigForm
                    refreshGigs={() => {
                      fetchGigs(search);
                      setIsFormOpen(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>


        <div className="space-y-40">
          <section className="space-y-12 pb-40">
            <div className="flex items-baseline gap-4">
              <h2 className="text-xs uppercase tracking-[0.5em] text-emerald-500 font-bold">
                {search ? `Query_Results: ${search}` : "Gig_Archive"}
              </h2>
              <div className="h-px flex-grow bg-white/5" />
              <span className="font-mono text-[10px] text-gray-500">
                {allGigs.length} NODES_ACTIVE
              </span>
            </div>

            {/* Active gigs */}
            <h2 className="text-sm uppercase tracking-[0.5em] text-lime-400 font-extrabold mt-12 mb-6 border-b-2 border-lime-500 pb-2">
              Active Gigs
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5 border border-white/5">
              {allGigs
                .filter(g => g.status !== "assigned")
                .map(gig => (
                  <div
                    key={gig._id}
                    className="bg-[#050607] p-1 hover:bg-emerald-500/5 transition-colors group"
                  >
                    <ClientGigCard
                      gig={gig}
                      onGigUpdate={(updatedGig) => {
                        if (updatedGig.deleted) {
                          setAllGigs((prev) => prev.filter(g => g._id !== updatedGig._id));
                        } else {
                          setAllGigs((prev) =>
                            prev.map(g => (g._id === updatedGig._id ? updatedGig : g))
                          );
                        }
                      }}
                    />
                  </div>
                ))}
            </div>

            <h2 className="text-sm uppercase tracking-[0.5em] text-yellow-400 font-extrabold mt-16 mb-6 border-b-2 border-yellow-400 pb-2">
              Assigned Gigs
            </h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5 border border-white/5">
              {allGigs
                .filter(g => g.status === "assigned")
                .map(gig => (
                  <div
                    key={gig._id}
                    className="bg-[#050607] p-1 opacity-80 hover:bg-emerald-500/5 transition-colors group"
                  >
                    <ClientGigCard
                      gig={gig}
                      onGigUpdate={(updatedGig) => {
                        if (updatedGig.deleted) {
                          setAllGigs((prev) => prev.filter(g => g._id !== updatedGig._id));
                        } else {
                          setAllGigs((prev) =>
                            prev.map(g => (g._id === updatedGig._id ? updatedGig : g))
                          );
                        }
                      }}
                    />
                  </div>
                ))}
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}


const HUDStat = ({ label, value, color = "text-white" }) => (
  <div className="p-8 min-w-[160px]">
    <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">
      {label}
    </p>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-mono tracking-tighter ${color}`}>
        {value}
      </span>
      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
    </div>
  </div>
);
