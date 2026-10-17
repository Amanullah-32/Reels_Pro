"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { useParams } from "next/navigation";
import Link from "next/link";
import { IKVideo } from "imagekitio-next";
import { useSession } from "next-auth/react";
import LikeButton from "@/components/LikeBtn";
import {
  ArrowLeft,
  Clapperboard,
  MessageCircle,
  Play,
  RefreshCw,
} from "lucide-react";
import CommentSection from "@/components/CommentSection";

export default function VideoDetails() {
  const [video, setVideo] = useState<IVideo | null>(null);
  const [isToggle, setIsToggle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    const fetchVideo = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/videos/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "This video could not be found."
              : "We couldn't load this video. Please try again."
          );
        }

        const data = await res.json();

        if (!data || !data._id) {
          throw new Error("This video could not be found.");
        }

        setVideo(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Error fetching video:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the video."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchVideo();

    return () => controller.abort();
  }, [id]);

  const handleToggle = () => {
    setIsToggle((previous) => !previous);
  };

  const userId = session?.user?.id;

  const isLiked =
    video?.likes?.some((likeId) => String(likeId) === String(userId)) ??
    false;

  const comments = video?.comments ?? [];
  const likes = video?.likes ?? [];

  // Loading state
  if (loading || status === "loading") {
    return (
      <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-white/[0.06]" />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="mx-auto w-full max-w-[420px]">
              <div className="aspect-[9/16] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
            </div>

            <div className="space-y-4">
              <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
              <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !video) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#070b14] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/20">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
            <Clapperboard className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Unable to load video
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {error || "This video may have been removed or is unavailable."}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // const ownerEmail = video.owner?.email || "ReelFlow Creator";
  // const ownerName = ownerEmail.split("@")[0];

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg text-sm text-gray-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to explore
          </Link>
        </div>

        {/* Main layout */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          {/* Video player */}
          <section className="min-w-0">
            <div className="relative mx-auto w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/30">
              <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Now playing
                </span>

                <Clapperboard className="h-5 w-5 text-white/80" />
              </div>

              <div className="relative aspect-[9/16] w-full">
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
                  controls={video.controls}
                  disablePictureInPicture
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Engagement controls */}
            <div className="mx-auto mt-4 flex w-full max-w-[460px] items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm font-medium text-white">
                  Enjoying this reel?
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Show the creator some love.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {session?.user && (
                  <div className="flex flex-col items-center gap-1.5">
                    <LikeButton
                      reelId={id}
                      userId={session.user.id}
                      initialLikes={likes.length}
                      initialIsLiked={isLiked}
                    />

                  </div>
                )}
{session?.user && (
  <div className="flex flex-col justify-center items-center">
                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={!session?.user}
                  aria-label={
                    isToggle ? "Hide comments" : "Show comments"
                  }
                  aria-expanded={isToggle}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isToggle
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
            
                <span className="text-xs font-medium pt-1.5">
                    {comments.length}
                  </span>
                  </div>
                )}
              </div>
            </div>

            {!session?.user && (
              <p className="mx-auto mt-3 max-w-[460px] text-center text-xs text-gray-500">
                Sign in to like videos and join the conversation.
              </p>
            )}
          </section>

          {/* Details and comments */}
          <aside className="flex min-w-0 flex-col gap-5">
            {/* Video details */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/10 sm:p-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                Video details
              </p>

              <h1 className="break-words text-xl font-semibold leading-7 tracking-tight text-white sm:text-2xl">
                {video.title}
              </h1>

              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-400">
                {video.description}
              </p>

              {/* <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Published by
                    </p>
                    <p className="truncate text-sm font-medium text-white">
                      {ownerName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {ownerEmail}
                    </p>
                  </div>
                </div>
              </div> */}
            </section>

            {/* Comments panel */}
            <section
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              id="comments"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                    Comments
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {comments.length}{" "}
                    comments
                  </p>
                </div>

                {session?.user && (
                  <button
                    type="button"
                    onClick={handleToggle}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {isToggle ? "Hide" : "Join discussion"}
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-5">
                {session?.user ? (
                  isToggle ? (
                    <CommentSection
                      initialComment={comments}
                      reelId={id}
                      user={session.user}
                    />
                  ) : (
                    <div className="py-5 text-center">
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <MessageCircle className="h-5 w-5" />
                      </div>

                      <p className="mt-3 text-sm font-medium text-gray-200">
                        Join the conversation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Share your thoughts about this video.
                      </p>

                      <button
                        type="button"
                        onClick={handleToggle}
                        className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                      >
                        Write a comment
                      </button>
                    </div>
                  )
                ) : (
                  <div className="py-6 text-center">
                    <MessageCircle className="mx-auto h-7 w-7 text-gray-600" />

                    <p className="mt-3 text-sm text-gray-300">
                      Want to join the conversation?
                    </p>

                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                      Sign in to comment
                    </Link>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
