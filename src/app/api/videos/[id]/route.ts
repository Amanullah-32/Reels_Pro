import { connectToDB } from "@/lib/db";
import Video from "@/models/Video";


import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest, {params}:{params :  Promise<{id : string}>}) {
    try {
      const {id} = await params;
      if(!id){
        return NextResponse.json({error : "Video id is undifind"},{status : 403})
      }
      
      await connectToDB();
      const videos = await Video.findById(id)
      
      if (!videos || videos.length === 0) {
        return NextResponse.json([], { status: 200 });
      }
  
      return NextResponse.json(videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: 500 }
      );
    }
  }