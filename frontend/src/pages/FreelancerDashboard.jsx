import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { socket } from "../socket";
import { motion, AnimatePresence } from "framer-motion";


export default function FreelancerDashboard() {

  const [openGigs, setOpenGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [isCounterBid, setIsCounterBid] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedGig, setSelectedGig] = useState(null);
  const [bidMessage, setBidMessage] = useState("");
  const [bidPrice, setBidPrice] = useState("");

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const fetchOpenGigs = async () => {
    try {
      const res = await api.get("/gigs");
      setOpenGigs(res.data || []);
    } catch (err) {
      console.error("FETCH_GIGS_ERROR:", err);
    }
  };

const getBidForGig = (gigId) => {
  return myBids.find(bid => {
    if (!bid.gigId) return false;

    if (typeof bid.gigId === "object" && bid.gigId._id) {
      return bid.gigId._id.toString() === gigId.toString();
    }

    return bid.gigId.toString() === gigId.toString();
  });
};

  const fetchMyBids = async () => {
    try {
      const res = await api.get("/bids/me");
      setMyBids(res.data || []);
    } catch (err) {
      console.error("FETCH_BIDS_ERROR:", err);
    }
  };

const openBidModal = (gig, counter = false) => {
  setSelectedGig(gig);
  setIsCounterBid(counter);
  if (!counter) setBidMessage("");
  setBidPrice(""); 
};

const submitBid = async () => {
  try {
    const existingBid = getBidForGig(selectedGig._id);

    if (existingBid?.status === "countered") {
      await api.patch(`/bids/${existingBid._id}/counter`, {
        counterPrice: bidPrice
      });
    } else {
      await api.post("/bids", {
        gigId: selectedGig._id,
        price: bidPrice,
        message: bidMessage
      });
    }

    setSelectedGig(null);
    setBidMessage("");
    setBidPrice("");
    fetchMyBids();
  } catch (err) {
    alert(err.response?.data?.error || "Action failed");
  }
};

  useEffect(() => {
    Promise.all([fetchOpenGigs(), fetchMyBids()]).finally(() =>
      setLoading(false)
    );
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();
    socket.emit("join", user._id);

socket.on("hired", ({ bid, gig }) => {
  setMyBids(prev =>
    prev.map(b => (b._id === bid._id ? bid : b))
  );

  fetchOpenGigs();
});

socket.on("bid_countered", ({ bid }) => {
  setMyBids(prev =>
    prev.map(b => (b._id === bid._id ? bid : b))
  );
});


    return () => {
      socket.off("hired");
      socket.off("bid_countered");
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center">
        <span className="text-emerald-500 font-mono text-xs uppercase">
          Synchronizing Sector...
        </span>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#050607] text-[#e4e4e4] font-sans selection:bg-emerald-500/30 overflow-x-hidden">

    <div
      className="fixed inset-0 z-0 pointer-events-none opacity-20"
      style={{
        backgroundImage:
          "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }}
    />
    <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-7xl border-x border-white/5 z-0" />

    <main className="relative z-10 max-w-7xl mx-auto px-8 py-24 space-y-32">

       <header className="relative pt-10">
  <div className="flex justify-between items-start mb-6">
    <div className="flex items-center gap-3">
      <div className="h-px w-12 bg-emerald-500" />
      <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 font-bold">
        Freelancer Protocol v2.1.0
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
  {user?.name?.toUpperCase() || "FREELANCER"} <br />
  <span className="italic font-light text-gray-600">NODE.</span>
</h1>


      <p className="text-gray-500 max-w-md text-sm uppercase tracking-widest leading-relaxed">
        Deploying skill nodes, negotiating contracts, and executing tasks across the network.
      </p>
    </div>
  </div>
</header>

      {/* ================= MY BIDS ================= */}
      <section className="space-y-12">
        <div className="flex items-baseline gap-4">
          <h2 className="text-xs uppercase tracking-[0.5em] text-lime-400 font-bold">
            My_Bids
          </h2>
          <div className="h-px flex-grow bg-lime-400/30" />

          <span className="text-[10px] font-mono text-gray-500">
            {myBids.length} ACTIVE
          </span>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className="bg-[#050607] p-1 hover:bg-emerald-500/5 transition-colors"
            >
              <div className="relative bg-[#0a0b0c] p-6 border border-white/5 hover:border-emerald-500/30 transition">

                <h3 className="text-lg uppercase font-bold mb-2">
                  {bid.gigId.title}
                </h3>

                <p className="text-xs uppercase tracking-wider text-gray-500 line-clamp-2 mb-4">
                  {bid.gigId.description}
                </p>

                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest text-gray-600">
                      Your_Bid
                    </p>
                    <p className="text-xl font-mono">₹{bid.price}</p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-1 border ${
                      bid.status === "accepted"
                        ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10"
                        : bid.status === "countered"
                        ? "text-blue-400 border-blue-400/20 bg-blue-400/10"
                        : "text-gray-400 border-white/10"
                    }`}
                  >
                    {bid.status.toUpperCase()}
                  </span>
                </div>

                {bid.counterPrice && (
                  <p className="text-[10px] font-mono text-blue-400 mt-2">
                    COUNTER: ₹{bid.counterPrice}
                  </p>
                )}

{bid.status === "countered" && (
  <div className="mt-4 flex gap-4">
    {/* UPDATE BID */}
    <button
      onClick={() => openBidModal(bid.gigId, true)}
      className="text-[10px] uppercase tracking-widest font-bold text-blue-400 hover:text-white"
    >
      [ Update_Bid ]
    </button>

    {/* ACCEPT COUNTER */}
    <button
      onClick={async () => {
        try {
          await api.patch(`/bids/${bid._id}/accept`);
          fetchMyBids();
          fetchOpenGigs();
        } catch (err) {
          alert("Failed to accept counter");
        }
      }}
      className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 hover:text-white"
    >
      [ Accept ]
    </button>
  </div>
)}

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= OPEN GIGS ================= */}
      <section className="space-y-12">
        <div className="flex items-baseline gap-4">
          <h2 className="text-xs uppercase tracking-[0.5em] text-yellow-400 font-bold">
            Open_Gigs
          </h2>
<div className="h-px flex-grow bg-yellow-400/60" />

        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {openGigs.map((gig) => {
            const bid = getBidForGig(gig._id);

            return (
              <div
                key={gig._id}
                className="bg-[#050607] p-1 hover:bg-emerald-500/5 transition"
              >
                <div className="bg-[#0a0b0c] p-6 border border-white/5 hover:border-emerald-500/30 transition">

                  <h3 className="text-lg uppercase font-bold mb-2">
                    {gig.title}
                  </h3>

                  <p className="text-xs uppercase tracking-wider text-gray-500 line-clamp-3 mb-4">
                    {gig.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <p className="text-xl font-mono">₹{gig.budget}</p>

                    {!bid && (
                      <button
                        onClick={() => openBidModal(gig)}
                        className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 hover:text-white"
                      >
                        [ Apply ]
                      </button>
                    )}

                    {bid && (
                      <span className="text-[10px] font-mono text-gray-500">
                        {bid.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>

    {/* ================= BID MODAL ================= */}
    <AnimatePresence>
      {selectedGig && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#0a0b0c] border border-white/10 p-10 w-full max-w-md"
          >
            <h3 className="text-xs uppercase tracking-[0.4em] mb-6 font-bold">
              {isCounterBid ? "Update_Bid" : "Deploy_Bid"}
            </h3>

            <input
              placeholder="BID_PRICE"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 mb-6 text-xs uppercase tracking-widest"
            />

            {!isCounterBid && (
              <textarea
                placeholder="BID_MESSAGE"
                value={bidMessage}
                onChange={(e) => setBidMessage(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-3 mb-8 text-xs uppercase tracking-widest"
              />
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setSelectedGig(null)}
                className="text-xs uppercase text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={submitBid}
                className="bg-emerald-600 px-8 py-3 text-black text-xs uppercase font-bold"
              >
                Execute
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  
);


}


