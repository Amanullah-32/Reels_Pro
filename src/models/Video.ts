import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width : 1080,
    height : 1920
} as const

// types.ts or inside your component file
export interface IPopulatedVideo {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  fileId : string;
  thumbnailUrl: string;
  controls?:boolean;
  owner: {
    _id: string;
    email: string;
  };
}

export interface IVideo{
    _id?:mongoose.Types.ObjectId;
    title : string;
    description : string;
    videoUrl : string;
    fileId : string,
    thumbnailUrl : string;
    controls?:boolean;
    transformation?: {
        height: number;
        width: number;
        quality?: number;
      };
    owner: mongoose.Types.ObjectId;
    likes : [mongoose.Types.ObjectId]
    comments : []
}

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  // createdAt: { type: Date, default: Date.now },
});

const videoSchema = new Schema<IVideo>(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      videoUrl: { type: String, required: true },
      fileId : {type: String, required: true},
      thumbnailUrl: { type: String, required: true },
      controls: { type: Boolean, default: true },
      transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 },
      },
      owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes : [{type : Schema.Types.ObjectId,ref : "User"}],
    comments : [commentSchema],
    },
    { timestamps: true }
  );
  
  const Video = models?.Video || model<IVideo>("Video", videoSchema);
  
  export default Video;