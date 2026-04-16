"use client"
import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { useParams } from "next/navigation";
import { IKVideo } from "imagekitio-next";
import { useSession } from "next-auth/react";
import LikeButton from "@/components/LikeBtn";
import { MessageCircle } from "lucide-react";
import CommentSection from "@/components/CommentSection";

export default function Home() {
  const [video, setVideos] = useState<IVideo | null>(null);
  const [isToggle, setIsToggle] = useState(false);
  const {id} =  useParams<{id : string}>()
  const seasion = useSession()
  

    useEffect(()=>{
      const fetchVideos = async () => {
        
      try {
        fetch(`/api/videos/${id}`).then((res)=>res.json()).then((data)=>{setVideos(data)})
        
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
      if(id){
      fetchVideos()
    }
    },[id])

    const handleToggle = () =>{
        setIsToggle(!isToggle)
      }
      const userId = seasion.data?.user.id
      const isLiked = video?.likes?.some((id) => id.toString() === userId) || false
    

    if(!video){
      return <div>Loading...</div>
    }

  return (
    <>
    
    <main className="container flex justify-center flex-col gap-5 lg:flex-row items-center mx-auto px-4 py-8 w-full">
      <div>
      <div
            className="rounded-xl overflow-hidden max-h-screen relative"
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
              controls={video.controls}
              disablePictureInPicture
              className="w-full h-full object-cover"
            />
      </div>
      { seasion.data?.user ?
      <div className="flex items-start p-2 gap-3">
        <div>
      <LikeButton reelId={id} userId={seasion.data.user.id} initialLikes={video.likes.length} initialIsLiked={isLiked} /></div>
      <div className="flex flex-col items-center gap-1">
      <button 
        onClick={handleToggle} 
        className="transition-transform active:scale-125 disabled:opacity-50"
      >
        <MessageCircle 
          size={28} 
          className={isToggle ? "fill-gray-600 text-red-500" : "text-white"} 
        />
      </button>
      <span className="text-white text-xs font-semibold">{video.comments.length}</span>
    </div>
       </div> : null}
      </div>
      {
        seasion.data?.user && isToggle ? <CommentSection initialComment={video.comments} reelId={id} user={seasion.data.user} /> : null
      }
    </main>
    </>
  );
}
