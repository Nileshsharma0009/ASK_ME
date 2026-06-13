import express from "express";
import { register, login, muteCompliance, updateSettings, guestLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/guest-login", guestLogin);

router.patch("/mute-compliance/:id", muteCompliance);

// router.patch("/reset-compliance/:id", async (req, res) => {
//   const { id } = req.params;
//   await User.findByIdAndUpdate(id, { hasMutedCompliance: false });
//   res.status(200).json({ message: "Reset successful" });
// });

router.patch("/reset-compliance/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Database mein 'false' set kar rahe hain
    await User.findByIdAndUpdate(id, { hasMutedCompliance: false });
    res.status(200).json({ success: true, message: "Reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting" });
  }
});

// Is route ko add karein
router.patch("/update-settings/:id", updateSettings);

export default router;