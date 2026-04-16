"use client"
import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IPopulatedVideo } from "@/models/Video";
import { useSession } from "next-auth/react";
import DeleteBtn from "@/components/DeleteBtn"

export default function VideoComponent({ video }:{ video: IPopulatedVideo }) {
  const {data : session} = useSession()
  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 pt-5">
      <div className="flex justify-center items-center pt-2">
      <p className="text-sm text-base-content/70 line-clamp-2">
          Post by :- {video.owner.email}
        </p>
        </div>
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
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
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
        <div>
          {video.owner._id == session?.user.id ? <DeleteBtn fileId={video.fileId}/> :null}
        </div>
      </div>
    </div>
  );
}