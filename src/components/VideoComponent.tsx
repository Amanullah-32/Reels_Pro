"use client";

import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IPopulatedVideo } from "@/models/Video";
import { useSession } from "next-auth/react";
import DeleteBtn from "@/components/DeleteBtn";
import { Play, UserRound } from "lucide-react";

export default function VideoComponent({
  video,
}: {
  video: IPopulatedVideo;
}) {
  const { data: session } = useSession();

  const isOwner =
    Boolean(session?.user?.id) &&
    String(video.owner?._id) === String(session?.user?.id);

  const ownerEmail = video.owner?.email || "ReelFlow Creator";
  const ownerName = ownerEmail.split("@")[0];

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-950/20">
      {/* Creator information */}
      <div className="flex items-center gap-3 px-4 pb-3 pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
          <UserRound className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-200">
            {ownerName}
          </p>
          <p className="text-xs text-gray-500">Creator</p>
        </div>

        {isOwner && (
          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-300">
            You
          </span>
        )}
      </div>

      {/* Portrait video */}
      <div className="px-3">
        <Link
          href={`/videos/${video._id}`}
          aria-label={`Watch ${video.title}`}
          className="relative block overflow-hidden rounded-xl bg-[#03060c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="relative aspect-[9/16] w-full overflow-hidden">
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              disablePictureInPicture
              controls={video.controls}
              className="h-full w-full object-cover"
            />

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/20">
              <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white opacity-0 shadow-xl backdrop-blur-sm transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Video details */}
      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <h2 className="line-clamp-2 text-base font-semibold leading-6 text-white transition-colors group-hover:text-blue-300">
            {video.title}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
          {video.description}
        </p>

        {isOwner && (
          <div className="mt-4 border-t border-white/[0.08] pt-3">
            <DeleteBtn fileId={video.fileId} />
          </div>
        )}
      </div>
    </article>
  );
}
