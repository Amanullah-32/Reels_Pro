import { IPopulatedVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { Clapperboard, Film } from "lucide-react";

interface VideoFeedProps {
  videos: IPopulatedVideo[];
  loading?: boolean;
}

export default function VideoFeed({
  videos,
  loading = false,
}: VideoFeedProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3"
          >
            <div className="aspect-[9/16] animate-pulse rounded-xl bg-white/[0.06]" />

            <div className="space-y-3 p-2 pt-4">
              <div className="h-3 w-2/5 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-5 w-4/5 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-3 w-full animate-pulse rounded bg-white/[0.06]" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-16 text-center sm:py-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
          <Clapperboard className="h-8 w-8" />
        </div>

        <h3 className="relative mt-6 text-xl font-semibold text-white">
          Its quiet in here
        </h3>

        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
          There are no videos to show right now. Be the first to share
          something with the ReelFlow community.
        </p>

        <a
          href="/upload"
          className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Film className="h-4 w-4" />
          Upload the first video
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoComponent
          key={video._id?.toString()}
          video={video}
        />
      ))}
    </div>
  );
}
