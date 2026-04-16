import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    const session = await getServerSession(authOptions);
          if (!session) {
            return NextResponse.json("Unauthorized", { status: 401 });
          }
    try{
        await connectToDB()
        const {reelId , text} = await req.json()
        if(!text?.trim()|| !reelId){
            return NextResponse.json({error : "text or userId requird"},{status : 400})
        }
        const newComment = {
            user : session.user.id,
            text : text
        }
        const updatedVideo = await Video.findByIdAndUpdate(reelId,{$push : {comments : newComment}},{ new: true })
        if (!updatedVideo) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
        return NextResponse.json({comment : updatedVideo},{status : 201})
    }catch(error){
        console.log(error)
return NextResponse.json({error : "server error"},{status : 500})
    }
    
}

export async function DELETE(req : Request){
    const session = await getServerSession(authOptions);
          if (!session) {
            return NextResponse.json("Unauthorized", { status: 401 });
          }
    try {
        await connectToDB()
        const {reelId , commentId} = await req.json()
        if (!reelId || !commentId) {
      return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
    }
    const video = await Video.findById(reelId)
    if (!video) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    const comment = video.comments.id(commentId)
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "You can only delete your own comments" }, { status: 403 });
    }
   await Video.findByIdAndUpdate(reelId , {
        $pull : {comments : {_id : commentId}}
    })
    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}