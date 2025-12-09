import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    preferredLanguage: {
      type: String,
      enum: ["hi", "en", "hinglish"],
      default: "hinglish",
    },
    defaultBank: { type: String, default: null },
  },
  { timestamps: true }
);

// Password helper
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;
