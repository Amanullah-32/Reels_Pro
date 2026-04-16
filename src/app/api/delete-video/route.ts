import ImageKit from "imagekit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Video from "@/models/Video";
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { file } = await req.json();
    await connectToDB()
    await imagekit.deleteFile(file);
    const deleteFile = await Video.findOneAndDelete({fileId : file})

    return NextResponse.json(deleteFile)
  } catch (error) {
    console.log(error)
    return  NextResponse.json("Error deleting", { status: 500 });
  }
}