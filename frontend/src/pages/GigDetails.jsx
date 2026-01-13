import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function GigDetails() {
  const { id } = useParams();

  const submitBid = async (e) => {
    e.preventDefault();
    await api.post("/bids", {
      gigId: id,
      message: e.target.message.value,
      price: e.target.price.value
    });
    alert("Bid submitted");
  };

  return (
    <form onSubmit={submitBid} className="max-w-lg mx-auto mt-10 space-y-3">
      <textarea name="message" placeholder="Message" className="border p-2 w-full" />
      <input name="price" placeholder="Price" className="border p-2 w-full" />
      <button className="bg-black text-white px-4 py-2">Submit Bid</button>
    </form>
  );
}
