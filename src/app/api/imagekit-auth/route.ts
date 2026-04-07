import { NextResponse } from "next/server";
import ImageKit from "imagekit";



export async function GET() {
  try {
    // Check for keys before creating the instance
    if (
      !process.env.NEXT_PUBLIC_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.NEXT_PUBLIC_URL_ENDPOINT
    ) {
      throw new Error("ImageKit environment variables are missing");
    }

    const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      {
        status: 500,
      }
    );
  }
}