import mongoose, { Schema } from "mongoose";
import { PassThrough } from "stream";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
