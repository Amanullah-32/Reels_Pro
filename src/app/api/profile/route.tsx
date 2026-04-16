import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Video from "@/models/Video";


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    const videos = await Video.find({"owner":session.user.id}).populate("owner","email").sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(videos);

}catch (error) {
    console.error("Error In Fetch The Profile:", error);
    return NextResponse.json(
      { error: "Failed To Fetch The Profile" },
      { status: 500 }
    );
  }
}