"use client"
import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { useParams } from "next/navigation";
import { IKVideo } from "imagekitio-next";

export default function Home() {
  const [video, setVideos] = useState<IVideo | null>(null);
  const {id} =  useParams<{id : string}>()
  

    

    useEffect(()=>{
      const fetchVideos = async () => {
        
      try {
        fetch(`/api/videos/${id}`).then((res)=>res.json()).then((data)=>{setVideos(data);console.log(data)})
        
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
      if(id){
      fetchVideos()
    }
    },[id])

    if(!video){
      return <div>Loading...</div>
    }

  return (
    <>
    
    <main className="container flex justify-center flex-col gap-5 lg:flex-row items-center mx-auto px-4 py-8 w-full">
      
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
              controls={video.controls}
              className="w-full h-full object-cover"
            />
      </div>
    </main>
    </>
  );
}
