import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Video, { IPopulatedVideo } from "@/models/Video";
import { connectToDB } from "@/lib/db";
import VideoComponent from "@/components/VideoComponent";
import Link from "next/link";
import {
  Video as VideoIcon,
  Upload,
  Clapperboard,
  ArrowRight,
  Film,
} from "lucide-react";

const Profile = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectToDB();

  const rawVideos = await Video.find({ owner: session.user.id })
    .populate("owner", "email")
    .sort({ createdAt: -1 })
    .lean();

  const videos = JSON.parse(
    JSON.stringify(rawVideos)
  ) as IPopulatedVideo[];

  const email = session.user?.email ?? "ReelFlow Creator";
  const username = email.split("@")[0];
  const initial = username.charAt(0).toUpperCase();
  const videoCount = videos.length;

  return (
    <main className="min-h-screen bg-[#070b14] text-white">

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        {/* Profile hero */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 sm:p-9 lg:p-10">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/25 to-indigo-600/20 text-2xl font-bold text-blue-300 shadow-lg shadow-blue-950/30 sm:h-20 sm:w-20 sm:text-3xl">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  <Clapperboard className="h-4 w-4" />
                  Creator Studio
                </p>

                <h1 className="truncate text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                  My Profile
                </h1>

                <p className="mt-2 max-w-full truncate text-sm text-gray-400 sm:text-base">
                  {email}
                </p>
              </div>
            </div>

            <Link
              href="/upload"
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-gray-200 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white sm:inline-flex"
            >
              Create something new
              <ArrowRight className="h-4 w-4 text-blue-400" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <VideoIcon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-semibold tabular-nums text-white">
                  {videoCount}
                </p>
                <p className="text-sm text-gray-400">
                  {videoCount === 1 ? "Video uploaded" : "Videos uploaded"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Film className="h-5 w-5" />
              </div>

              <div>
                <p className="text-base font-semibold text-white">
                  Your library
                </p>
                <p className="text-sm text-gray-400">
                  Your uploaded videos in one place
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video library heading */}
        <section className="mt-10 sm:mt-12">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Your collection
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                My Videos
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                All the videos you have uploaded to ReelFlow.
              </p>
            </div>

            {videoCount > 0 && (
              <Link
                href="/upload"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-400 transition hover:text-blue-300"
              >
                Upload another video
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {/* Video grid or empty state */}
          {videoCount > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video: IPopulatedVideo) => (
                <div
                  key={video._id?.toString()}
                  className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-950/20"
                >
                  <VideoComponent video={video} />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-14 text-center sm:py-20">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                <Clapperboard className="h-8 w-8" />
              </div>

              <h3 className="relative mt-6 text-xl font-semibold text-white sm:text-2xl">
                Your story starts here
              </h3>

              <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400 sm:text-base">
                You haven&apos;t uploaded any videos yet. Share your first
                video and start building your collection.
              </p>

              <Link
                href="/upload"
                className="relative mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30"
              >
                <Upload className="h-4 w-4" />
                Upload your first video
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
