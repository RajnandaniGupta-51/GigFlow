import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import Navbar from "./pages/Navbar"; // Assuming you moved it to components
import ProtectedRoute from "./pages/ProtectedRoute";
import FreelancerDashboard from "./pages/FreelancerDashboard";

export default function App() {
  return (
    <div className="bg-[#050607] min-h-screen">
      {/* Navbar sits outside Routes so it's always visible */}
      <Navbar />
      
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute role="client">
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/freelancer/dashboard"
        element={
          <ProtectedRoute role="freelancer">
            <FreelancerDashboard />
          </ProtectedRoute>
        }
      />
        </Routes>
      </main>

      {/* Optional: Add a global scanline or noise texture here to match your theme */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}