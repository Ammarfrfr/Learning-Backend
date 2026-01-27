import mongoose, {Schema} from "mongoose";
import { Tweet } from "./tweet.model";

const likeSchema = new Schema(
  {
    video:{
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    tweet:[{
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    }],
    comment:[{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  },
  {timestamps: true}
)

export const Likes = mongoose.model("Likes", likeSchema)