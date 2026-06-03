// ============================================
// AUTH CONTROLLER - Staff Login & Registration
// ============================================
// TODO: Implement login & register logic

const express = require('express');
const api = express.Router();

// @POST /api/auth/register
// Expected body: { name, email, password }
// TODO: Hash password with bcryptjs, save to MongoDB
async function register(req, res) {
  // TODO: Validate input
  // TODO: Check if user exists
  // TODO: Hash password
  // TODO: Save user to database
  // TODO: Return token and user data
}

// @POST /api/auth/login
// Expected body: { username (or email), password }
// TODO: Find user, validate password, generate JWT token
async function login(req, res) {
  // TODO: Find user by username/email
  // TODO: Compare password hash
  // TODO: Generate JWT token
  // TODO: Return token and user data
}

// @POST /api/auth/logout
async function logout(req, res) {
  // TODO: Optional: Invalidate token on backend
}

module.exports = { register, login, logout };
