import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Register() {
  const [params] = useSearchParams();
  const role = params.get("role") || "user"; 
  const navigate = useNavigate();
  const { register } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const newUser = await register({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role 
    })
    if (newUser.role === "freelancer") {
      navigate("/freelancer/dashboard", { replace: true });
    } else {
      navigate("/client/dashboard", { replace: true });
    }
  } catch (err) {
    console.error("Registration failed", err);
  }
};
  const inputStyles = "w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 text-white font-mono";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050607] px-6 relative overflow-hidden">
      
    
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#0a0b0c] border border-white/5 p-10 backdrop-blur-xl relative">
          
    
          <div className="absolute -top-3 left-10 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1">
            Sector: {role}
          </div>

          <header className="mb-10">
            <h2 className="text-xs uppercase tracking-[0.5em] text-gray-500 font-bold mb-2">Protocol_Initialization</h2>
            <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Sign Up.</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-600 font-mono">Identification_Name</label>
              <input name="name" type="text" placeholder="FULL NAME" className={inputStyles} required />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-600 font-mono">Input_Email</label>
              <input name="email" type="email" placeholder="USER@DOMAIN.COM" className={inputStyles} required />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-600 font-mono">Security_Key</label>
              <input type="password" name="password" placeholder="••••••••" className={inputStyles} required />
            </div>

            <button className="relative group w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all overflow-hidden mt-4">
              <span className="relative z-10 text-white">Initialize_Account</span>
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </button>
          </form>

  
          <footer className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Identity already exists?{" "}
              <Link 
                to={`/login?role=${role}`} 
                className="text-emerald-500 hover:text-white transition-colors font-bold"
              >
                [ Return_To_Login ]
              </Link>
            </p>
          </footer>
        </div>
        
        <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </motion.div>
    </div>
  );
}