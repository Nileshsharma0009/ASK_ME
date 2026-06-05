// backend/src/routes/system.routes.js
import express from "express";
import { getComplianceConfig } from "../controllers/system.controller.js";

const router = express.Router();

// Maps dynamically to our modularized system controller layout
router.get('/compliance-config', getComplianceConfig);

export default router;