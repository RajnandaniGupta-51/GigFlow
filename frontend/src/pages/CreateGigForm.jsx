import { useState } from "react";
import api from "../api/axios";

export default function CreateGigForm({ refreshGigs }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/gigs", { title, description, budget });
    setTitle(""); setDescription(""); setBudget("");
    refreshGigs();
  };

  const inputStyles = "w-full bg-transparent border-b border-white/10 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-gray-700 text-white font-light uppercase tracking-widest";

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-[0.3em] text-emerald-500 font-bold">01. Project_Title</label>
            <input
              placeholder="ENTER GIG NOMENCLATURE..."
              className={inputStyles}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-[0.3em] text-emerald-500 font-bold">02. Financial_Allocation</label>
            <input
              placeholder="VALUE IN INR (₹)..."
              className={inputStyles}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-[0.3em] text-emerald-500 font-bold">03. Protocol_Description</label>
          <textarea
            placeholder="DEFINE SCOPE OF WORK AND DELIVERABLES..."
            className={`${inputStyles} h-full min-h-[120px] resize-none`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <button className="relative group overflow-hidden bg-emerald-600 text-white px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all">
        <span className="relative z-10">Deploy_Gig</span>
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
      </button>
    </form>
  );
}