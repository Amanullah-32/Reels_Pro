import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Video, { IPopulatedVideo } from "@/models/Video";
import { connectToDB } from "@/lib/db";
import VideoComponent from "@/components/VideoComponent";
import { Home } from "lucide-react";
import Link from "next/link";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login"); // redirect if not logged in
  }
  await connectToDB();
  const rawVideos = await Video.find({ owner: session.user.id })
    .populate("owner", "email")
    .sort({ createdAt: -1 })
    .lean();

  if (!rawVideos || rawVideos.length === 0) {
    return <div>
      <div className="navbar bg-base-300 top-0 z-40 relative">
        <div className="flex-1 px-2 lg:flex-none">
          <Link
            href="/"
            className="btn btn-ghost text-xl gap-2 normal-case font-bold"
            prefetch={true}
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
        {session?.user.email}
        </div>
      </div>
      <div className="flex justify-center items-center pt-5">
      <p>No Videos.</p></div>
      </div>;
  }
  const videos = JSON.parse(JSON.stringify(rawVideos));

  return (
    <div>
      <div className="navbar bg-base-300 top-0 z-40 relative">
        <div className="flex-1 px-2 lg:flex-none">
          <Link
            href="/"
            className="btn btn-ghost text-xl gap-2 normal-case font-bold"
            prefetch={true}
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
        {session?.user.email}
        </div>
      </div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video : IPopulatedVideo) => (
          <VideoComponent key={video._id?.toString()} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
