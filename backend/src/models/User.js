// ============================================
// USER MODEL - Mongoose Schema
// ============================================
// Stores Doctor, Staff, and Administrator data

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // TODO: Add validation
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // TODO: Add email validation
    },
    username: {
      type: String,
      unique: true,
      // TODO: Add username field if needed
    },
    password: {
      type: String,
      required: true,
      // TODO: Hash password before saving using bcryptjs
      // TODO: Add pre-save hook to hash passwords
    },
    role: {
      type: String,
      enum: ['doctor', 'staff', 'admin'],
      default: 'staff',
      // TODO: Define roles based on permissions
    },
    department: String,
    // TODO: Add additional fields (phone, specialization, etc.)
  },
  { timestamps: true }
);

// TODO: Add pre-save hook to hash password
// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcryptjs.hash(this.password, 10);
//   next();
// });

// TODO: Add method to compare passwords
// UserSchema.methods.comparePassword = async function(password) {
//   return await bcryptjs.compare(password, this.password);
// };

module.exports = mongoose.model('User', UserSchema);
