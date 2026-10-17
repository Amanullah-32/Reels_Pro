"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

interface ILike {
  reelId?: string;
  userId?: string;
  initialLikes?: number;
  initialIsLiked?: boolean;
}

export default function LikeButton({
  reelId,
  userId,
  initialLikes = 0,
  initialIsLiked = false,
}: ILike) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLike = async () => {
    if (loading || !userId || !reelId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, userId }),
      });

      if (!response.ok) {
        throw new Error("Unable to update your like. Please try again.");
      }

      const data = await response.json();

      setLikesCount(data.likesCount);
      setIsLiked(data.isLiked);
    } catch (err) {
      console.error("Failed to update like:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        type="button"
        onClick={handleLike}
        disabled={loading || !userId || !reelId}
        aria-label={isLiked ? "Unlike video" : "Like video"}
        aria-pressed={isLiked}
        title={
          !userId
            ? "Sign in to like this video"
            : isLiked
              ? "Unlike video"
              : "Like video"
        }
        className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
          isLiked
            ? "border-red-500/25 bg-red-500/10 text-red-400 shadow-lg shadow-red-950/20 hover:bg-red-500/15"
            : "border-white/10 bg-white/[0.04] text-gray-300 hover:border-red-500/30 hover:bg-red-500/[0.08] hover:text-red-400"
        }`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Heart
            className={`h-5 w-5 transition duration-200 group-hover:scale-110 ${
              isLiked ? "fill-red-500 text-red-500" : ""
            }`}
          />
        )}

        {isLiked && !loading && (
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-red-400/10" />
        )}
      </button>

      <span
        aria-live="polite"
        className={`text-xs font-semibold tabular-nums ${
          isLiked ? "text-red-400" : "text-gray-400"
        }`}
      >
        {likesCount ?? 0} {(likesCount ?? 0) === 1 ? "like" : "likes"}
      </span>

      {error && (
        <p role="alert" className="max-w-32 text-center text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
