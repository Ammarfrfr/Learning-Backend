import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginateV2 from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content:{
      type: String,
      required: true
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
)

// mongooseAggregatePaginateV2 is a pagination plugin for mongoose schemas which helps in paginating large datasets efficiently in the way that we can fetch data in chunks rather than loading everything at once which improves performance and user experience.
commentSchema.plugin(mongooseAggregatePaginateV2)

export const Comment = mongoose.model("Comment", commentSchema)