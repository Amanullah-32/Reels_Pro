"use client";
import { useState } from "react";
import { Heart } from "lucide-react";

interface ILike {
  reelId? : string;
  userId? : string;
  initialLikes? : number
  initialIsLiked? : boolean
}

export default function LikeButton({ reelId, userId , initialLikes , initialIsLiked} : ILike) {
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setLikesCount(data.likesCount);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error("Failed to like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button 
        onClick={handleLike} 
        disabled={loading}
        className="transition-transform active:scale-125 disabled:opacity-50"
      >
        <Heart 
          size={28} 
          className={isLiked ? "fill-red-500 text-red-500" : "text-white"} 
        />
      </button>
      <span className="text-white text-xs font-semibold">{likesCount}</span>
    </div>
  );
}