const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Signup method
userSchema.statics.signup = async function (name, email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password must be at least 8 characters long, and contain at least one uppercase"
    );
  }
  const exists = await this.findOne({ email });
  if (exists) throw Error("Email already exists");
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, email, password: hash });
  return user;
};

// Login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Invalid email");
  }
  const user = await this.findOne({ email });
  if (!user) throw Error("Incorrect email");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw Error("Incorrect password");
  return user;
};

// Update user method
userSchema.statics.updateUser = async function (id, updates) {
  if (!id) throw Error("User ID must be provided");

  // Validate email if it's being updated
  if (updates.email && !validator.isEmail(updates.email)) {
    throw Error("Invalid email");
  }
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(updates.password, salt);
    updates.password = hash;
  } else {
    let { password } = await this.findById(id).select("password");
    updates.password = password;
  }

  const user = await this.findByIdAndUpdate(id, updates, { new: true });
  if (!user) throw Error("User not found");
  return user;
};

// Delete user method
userSchema.statics.deleteUser = async function (id) {
  if (!id) throw Error("User ID must be provided");
  const user = await this.findByIdAndDelete(id);
  if (!user) throw Error("User not found");
  return user;
};

module.exports = model("User", userSchema);
