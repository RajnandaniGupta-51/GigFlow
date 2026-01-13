import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const [params] = useSearchParams();
  const roleQuery = params.get("role");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "client") navigate("/client/dashboard");
      else if (user.role === "freelancer") navigate("/freelancer/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const loggedInUser = await login({ email, password });

    const userRole = loggedInUser?.role || roleQuery;

    if (userRole === "client") {
  navigate("/client/dashboard");
} else {
  navigate("/freelancer/dashboard");
}
  } catch (err) {
    console.error("Login Failed", err);
  }
};
  const inputStyles = "w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 text-white font-mono";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050607] px-6 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#0a0b0c] border border-white/5 p-10 backdrop-blur-xl relative">
  
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-emerald-500/20" />
          
          <header className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.5em] text-emerald-500 font-bold mb-2">Security_Gate</h2>
            <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Access Console.</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Input_Email</label>
              <input name="email" type="email" placeholder="USER@DOMAIN.COM" className={inputStyles} required />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-500 font-mono">Security_Key</label>
              <input type="password" name="password" placeholder="••••••••" className={inputStyles} required />
            </div>

            <button className="relative group w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all overflow-hidden">
              <span className="relative z-10">Authorize_Access</span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </form>

          <footer className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              New to the protocol?{" "}
              <Link 
                to={`/register${roleQuery ? `?role=${roleQuery}` : ""}`} 
                className="text-emerald-500 hover:text-white transition-colors font-bold"
              >
                [ Initialize_New_Account ]
              </Link>
            </p>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}