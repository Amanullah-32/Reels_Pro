"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import {
  Loader2,
  Upload,
  Video,
  FileVideo,
  CheckCircle2,
  ArrowRight,
  Clapperboard,
  Type,
  AlignLeft,
} from "lucide-react";
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";
import { useRouter } from "next/navigation";

interface VideoFormData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  fileId: string;
}

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);

  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      fileId: "",
    },
  });

  const title = watch("title");
  const description = watch("description");

  const handleUploadSuccess = (response: IKUploadResponse) => {
    setValue("videoUrl", response.filePath, {
      shouldValidate: true,
    });
    setValue(
      "thumbnailUrl",
      response.thumbnailUrl || response.filePath
    );
    setValue("fileId", response.fileId);

    setVideoUploaded(true);
    setUploadProgress(100);

    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data: VideoFormData) => {
    if (!data.videoUrl || !data.fileId) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);

    try {
      await apiClient.createVideo(data);

      showNotification("Video published successfully!", "success");

      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setValue("fileId", "");

      setUploadProgress(0);
      setVideoUploaded(false);

      router.push("/");
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* Title */}
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="flex items-center gap-2 text-sm font-medium text-gray-200"
        >
          <Type className="h-4 w-4 text-blue-400" />
          Video title
          <span className="text-red-400">*</span>
        </label>

        <input
          id="title"
          type="text"
          placeholder="Give your video a catchy title"
          {...register("title", {
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
            maxLength: {
              value: 100,
              message: "Title cannot exceed 100 characters",
            },
          })}
          className={`w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:bg-white/[0.06] focus:ring-4 ${
            errors.title
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
              : "border-white/10 focus:border-blue-500 focus:ring-blue-500/10"
          }`}
        />

        <div className="flex items-center justify-between gap-3">
          {errors.title ? (
            <p className="text-xs text-red-400">
              {errors.title.message}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Choose a title that grabs attention.
            </p>
          )}

          <span className="shrink-0 text-xs text-gray-500">
            {title?.length ?? 0}/100
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-medium text-gray-200"
        >
          <AlignLeft className="h-4 w-4 text-blue-400" />
          Description
          <span className="text-red-400">*</span>
        </label>

        <textarea
          id="description"
          rows={4}
          placeholder="Tell viewers what your video is about..."
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
            maxLength: {
              value: 1000,
              message: "Description cannot exceed 1000 characters",
            },
          })}
          className={`w-full resize-y rounded-xl border bg-white/[0.04] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-gray-500 focus:bg-white/[0.06] focus:ring-4 ${
            errors.description
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
              : "border-white/10 focus:border-blue-500 focus:ring-blue-500/10"
          }`}
        />

        <div className="flex items-center justify-between gap-3">
          {errors.description ? (
            <p className="text-xs text-red-400">
              {errors.description.message}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Add context to help viewers discover your video.
            </p>
          )}

          <span className="shrink-0 text-xs text-gray-500">
            {description?.length ?? 0}/1000
          </span>
        </div>
      </div>

      {/* Video upload */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
          <Video className="h-4 w-4 text-blue-400" />
          Upload your video
          <span className="text-red-400">*</span>
        </label>

        <div
          className={`rounded-2xl border bg-white/[0.02] p-4 transition sm:p-5 ${
            videoUploaded
              ? "border-blue-500/30"
              : "border-white/10"
          }`}
        >
          <FileUpload
            fileType="video"
            onSuccess={handleUploadSuccess}
            onProgress={handleUploadProgress}
          />

          {/* Upload status */}
          {uploadProgress > 0 && (
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  {videoUploaded ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-400" />
                  ) : (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-400" />
                  )}

                  <span className="truncate text-gray-300">
                    {videoUploaded
                      ? "Video uploaded successfully"
                      : "Uploading your video..."}
                  </span>
                </div>

                <span className="shrink-0 font-medium tabular-nums text-blue-400">
                  {Math.round(uploadProgress)}%
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Video upload progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(uploadProgress)}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(0, uploadProgress))}%`,
                  }}
                />
              </div>

              {videoUploaded && (
                <p className="text-xs text-gray-500">
                  Your video is ready to publish.
                </p>
              )}
            </div>
          )}

          {uploadProgress === 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <FileVideo className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
              <p className="text-xs leading-5 text-gray-500">
                Select a video using the uploader above. Keep this page
                open while your video is uploading.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Publish button */}
      <div className="border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={loading || !videoUploaded}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Publishing video...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Publish video
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gray-500">
          <Clapperboard className="h-3.5 w-3.5" />
          Your next great video starts here.
        </p>
      </div>
    </form>
  );
}
