// ============================================
// AUTH CONTROLLER - Staff Login & Registration
// ============================================
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

// Helper regex format matching standard healthcare/corporate email patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ==========================================================================
// @POST /api/auth/register
// ==========================================================================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();

    // STRICT ACCORDING TO USER PARAMETERS Check
    if (trimmedName.length >= 30) {
      return res.status(400).json({ message: "Name must be less than 30 characters" });
    }

    if (trimmedEmail.length >= 30) {
      return res.status(400).json({ message: "Email must be less than 30 characters" });
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({ message: "Please provide a valid email format" });
    }

    if (password.length >= 12) {
      return res.status(400).json({ message: "Password must be less than 12 characters" });
    }

    // Guard against NoSQL Query Injection
    const userExists = await User.findOne({ email: { $eq: trimmedEmail } });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashpassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashpassword,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
  id: user._id,
  name: user.name,
  email: user.email,
  hasMutedCompliance: user.hasMutedCompliance // ◄ PASS THIS
},
    });
  } catch (errr) {
    console.error("Registration error:", errr);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// ==========================================================================
// @POST /api/auth/login
// ==========================================================================
// ==========================================================================
// @POST /api/auth/login
// ==========================================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const trimmedEmail = String(email).trim();

    // Mirroring validation rules to prevent unnecessary database hits
    if (trimmedEmail.length >= 30 || password.length >= 12) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email: { $eq: trimmedEmail } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENVIRONMENT === "production";
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token,
      user: {
  id: user._id,
  name: user.name,
  email: user.email,
  hasMutedCompliance: user.hasMutedCompliance // ◄ PASS THIS
},
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

// ==========================================================================
// @POST /api/auth/logout
// ==========================================================================
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENVIRONMENT === "production";
    
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });
    
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout exception tracking sequence error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const muteCompliance = async (req, res) => {
  try {
    const { id } = req.params;
    // Uses findByIdAndUpdate to target only this logged-in user profile
    await User.findByIdAndUpdate(id, { hasMutedCompliance: true });
    return res.status(200).json({ success: true, message: "Compliance preferences saved." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update configuration flags." });
  }
};



// export const updateSettings = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { disclaimerEnabled } = req.body; // Toggle state yahan ayega

//     // Database mein update karein
//     const updatedUser = await User.findByIdAndUpdate(
//       id, 
//       { disclaimerEnabled }, 
//       { new: true }
//     );

//     res.status(200).json({ 
//       success: true, 
//       user: updatedUser 
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Settings update failed", error: err.message });
//   }
// };



export const updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    // Database field name match karein: hasMutedCompliance
    const { hasMutedCompliance } = req.body; 

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { $set: { hasMutedCompliance } }, 
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      success: true, 
      user: updatedUser 
    });
  } catch (err) {
    res.status(500).json({ message: "Settings update failed", error: err.message });
  }
};