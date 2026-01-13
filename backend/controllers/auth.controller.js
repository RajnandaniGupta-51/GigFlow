import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Incoming Registration:", { name, email, role });

    let assignedRole = role ? role.toLowerCase() : "client";
    if (assignedRole === "user") assignedRole = "client"; 

    const hashed = await bcrypt.hash(password, 10);
  
    const user = await User.create({ 
      name, 
      email, 
      password: hashed, 
      role: assignedRole 
    });

    const token = jwt.sign({ id: user._id , role: user.role}, process.env.JWT_SECRET, { expiresIn: "7d" });


    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false 
    });

    res.status(201).json({
      message: "Node_Initialized: Account created.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("DETAILED_BACKEND_ERROR:", error);
    

    if (error.code === 11000) {
      return res.status(400).json({ message: "Identity exists: Email already in archive." });
    }
    
    
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Protocol violation: Invalid role data." });
    }
    
    res.status(500).json({ message: "Internal System Failure: " + error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false 
  });

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role 
    }
  });
};


export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
