import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req : Request){
    const session = await getServerSession(authOptions);
    
      if (!session) {
        return new Response("Unauthorized", { status: 401 });
      }

      try {
        const {reelId, userId} = await req.json()
        if (!reelId || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
        await connectToDB()
         const reel = await Video.findById(reelId)
    if (!reel) return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    const hasLiked = reel.likes.includes(userId)

    const update = hasLiked 
      ? { $pull: { likes: userId } } 
      : { $addToSet: { likes: userId } };

      const updatedReel = await Video.findByIdAndUpdate(reelId, update, { new: true });

      return NextResponse.json({ 
      likesCount: updatedReel.likes.length, 
      isLiked: !hasLiked 
    });

      } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
      }
}