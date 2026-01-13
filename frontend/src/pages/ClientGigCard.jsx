import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function ClientGigCard({ gig, onGigUpdate }) {
  const [bids, setBids] = useState([]);
  const [showBids, setShowBids] = useState(false);
  const [hasResponses, setHasResponses] = useState(false);

  const fetchBids = async () => {

    if (!showBids) {
      try {
        const res = await api.get(`/bids/${gig._id}`);
        setBids(res.data);
      } catch (err) {
        console.error("BID_FETCH_ERROR:", err);
      }
    }
    setShowBids(!showBids);
  };

  const handleHire = async (bidId) => {
    if (!window.confirm("CONFIRM_ACTION: Initialize hiring protocol for this node?")) return;

    try {
      const res = await api.patch(`/bids/${bidId}/hire`);

      const { gig: updatedGig, bid: updatedBid } = res.data;

      setBids((prev) =>
        prev.map((b) => (b._id === updatedBid._id ? updatedBid : b))
      );
      onGigUpdate(updatedGig);

    } catch (err) {
      alert("CRITICAL_ERROR: Action failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("CONFIRM_ACTION: Delete this gig permanently?")) return;

    try {
      await api.delete(`/gigs/${gig._id}`);
      onGigUpdate({ _id: gig._id, deleted: true });
    } catch (err) {
      alert("CRITICAL_ERROR: Gig deletion failed");
    }
  };



  const handleCounter = async (bidId) => {
    const newPrice = prompt("INPUT_REQUIRED: Enter counter offer price (₹):");
    if (!newPrice || isNaN(newPrice)) return;

    try {
      await api.patch(`/bids/${bidId}/counter`, { counterPrice: newPrice });
      alert("SIGNAL_SENT: Counter offer dispatched to freelancer.");

      const res = await api.patch(`/bids/${bidId}/counter`, { counterPrice: newPrice });

      setBids((prev) =>
        prev.map((b) => (b._id === res.data._id ? res.data : b))
      );

    } catch (err) {
      alert("CRITICAL_ERROR: Bargain failed");
    }
  };

  useEffect(() => {
    const checkBids = async () => {
      try {
        const res = await api.get(`/bids/${gig._id}`);
        setBids(res.data);
        setHasResponses(res.data.length > 0);
      } catch (err) {
        console.error("BID_FETCH_ERROR:", err);
      }
    };

    checkBids();
  }, [gig._id]);

  return (
    <div className="relative group bg-[#0a0b0c] p-6 border border-white/5 hover:border-emerald-500/30 transition-all duration-500">

      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-emerald-500/50 transition-colors" />

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold tracking-tight text-white uppercase relative">
            {gig.title}


            {hasResponses && gig.status !== "assigned" && (
              <span
                className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
                title="New Responses!"
              />
            )}

          </h3>

          <span
            className={`text-[10px] font-mono px-2 py-1 border ${gig.status === 'assigned'
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-white/5 text-gray-400 border-white/10'
              }`}
          >
            {gig.status.toUpperCase()}
          </span>
        </div>

        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 uppercase tracking-wider font-light">
          {gig.description}
        </p>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-gray-600 mb-1">Target_Budget</p>
            <p className="text-xl font-mono text-white">₹{gig.budget}</p>
          </div>
          <button
            onClick={fetchBids}
            className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 hover:text-white transition-colors"
          >
            {showBids ? "[ Close_Feed ]" : "[ View_Responses ]"}
          </button>
        </div>

        <button
          onClick={handleDelete}
          className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-400 transition-colors"
        >
          [ Delete_Gig ]
        </button>


      </div>

      <AnimatePresence>
        {showBids && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3 border-t border-white/5 pt-4 overflow-hidden"
          >
            {bids.length === 0 ? (
              <p className="text-[10px] font-mono text-gray-600 italic">SYSTEM_STATUS: NO_RESPONSES_DETECTED</p>
            ) : (
              bids.map((bid) => (
                <div key={bid._id} className="bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.04] transition-colors">

                  <p className="text-xs">Freelancer: {bid.freelancerId.name}</p>
                  <p className="text-xs mb-2">Email: {bid.freelancerId.email}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] font-mono ${bid.status === 'accepted' ? 'text-emerald-500' :
                        bid.status === 'rejected' ? 'text-red-500' : 'text-gray-400'
                      }`}>
                      STATUS: {bid.status.toUpperCase()}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-white block">₹{bid.price}</span>
                      {bid.counterPrice && (
                        <span className="text-[8px] font-mono text-blue-400">COUNTER: ₹{bid.counterPrice}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-4 font-light italic">"{bid.message}"</p>


                  {bid.status === "pending" || bid.status === "countered" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleHire(bid._id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-black text-[9px] px-3 py-1 font-bold uppercase transition-colors"
                      >
                        Accept & Hire
                      </button>
                      <button
                        onClick={() => handleCounter(bid._id)}
                        className="border border-white/20 hover:border-white/40 text-white text-[9px] px-3 py-1 font-bold uppercase transition-colors"
                      >
                        Bargain
                      </button>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}