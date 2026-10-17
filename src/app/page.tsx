"use client";

import React, { useEffect, useState } from "react";
import {
  RefreshCw,
} from "lucide-react";
import VideoFeed from "@/components/VideoFeed";
import { IPopulatedVideo } from "@/models/Video";
import { apiClient } from "@/lib/api-client";

export default function Home() {
  const [videos, setVideos] = useState<IPopulatedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiClient.getVideos();
      setVideos(data);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("We couldn't load the videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchVideos();
  }, []);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

        {/* Feed heading */}
        <section id="video-feed" className="scroll-mt-24 pt-10">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                The community feed
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Explore videos
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                Fresh content from the ReelFlow community.
              </p>
            </div>

            {!loading && !error && (
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-gray-400">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                {videos.length} {videos.length === 1 ? "video" : "videos"}
              </div>
            )}
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-5 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <RefreshCw className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                Something went wrong
              </h3>

              <p className="mt-2 text-sm text-gray-400">{error}</p>

              <button
                type="button"
                onClick={fetchVideos}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : (
            <VideoFeed videos={videos} loading={loading} />
          )}
        </section>
      </div>
    </main>
  );
}
