
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import VideoUploadForm from "../../components/VideoUploadForm";

export default async function VideoUploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // redirect if not logged in
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Upload New Reel</h1>
        <VideoUploadForm />
      </div>
    </div>
  );
}