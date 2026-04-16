"use client"
import React, { useEffect, useState } from "react";
import VideoFeed from "../components/VideoFeed";
import { IPopulatedVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";
import Header from "@/components/Header";

export default function Home() {
  const [videos, setVideos] = useState<IPopulatedVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
    <Header/>
    <main className="container mx-auto px-4 py-8">
      
      <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
      <VideoFeed videos={videos} />
    </main>
    </>
  );
}
