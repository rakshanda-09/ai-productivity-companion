const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },

    // Used by the Smart Scheduler to know the user's working window
    workingHours: {
      start: { type: String, default: "09:00" }, // HH:mm, 24h
      end: { type: String, default: "21:00" },
    },

    // Editable productivity preferences, surfaced on the Settings page
    preferences: {
      focusBlockMinutes: { type: Number, default: 50 },
      breakMinutes: { type: Number, default: 10 },
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    workingHours: this.workingHours,
    preferences: this.preferences,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
