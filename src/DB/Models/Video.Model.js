import mongoose, {model, Schema, Types} from "mongoose";
export const videoSchema = new Schema(
  {
    attachments: [{secure_url: String, public_id: String}],
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
);

export const videoModel = mongoose.models.Video || model("Video", videoSchema);
