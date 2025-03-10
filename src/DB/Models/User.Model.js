import mongoose, {model, Schema} from "mongoose";
import {type} from "os";
export const providerTypes = {google: "google", system: "system"};

export const userSchema = new Schema(
  {
    userName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    confirmEmailOTP: String,
    password: {
      type: String,
      required: (data) => {
        data?.provider === providerTypes.google ? false : true;
      },
    },
    resetPasswordOTP: String,
    confirmEmail: {type: Boolean, default: false},
    changeTimeCredential: Date,
    image: String,
    provider: {
      type: String,
      enum: Object.values(providerTypes),
      default: providerTypes.system,
    },
  },
  {timestamps: true}
);
export const userModel = mongoose.models.User || model("User", userSchema);
