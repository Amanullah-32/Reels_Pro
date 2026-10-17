
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, X, AlertTriangle } from "lucide-react";
import { useNotification } from "./Notification";

const DeleteBtn = ({ fileId }: { fileId: string }) => {
  const router = useRouter();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/delete-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: fileId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete video. Please try again.");
      }

      showNotification("Video deleted successfully", "success");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "Something went wrong while deleting the video",
        "error"
      );
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-sm font-medium text-red-400 transition duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete video
      </button>

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              setConfirmDelete(false);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b1120] p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h2
              id="delete-title"
              className="mt-5 text-lg font-semibold text-white"
            >
              Delete this video?
            </h2>

            <p
              id="delete-description"
              className="mt-2 text-sm leading-6 text-gray-400"
            >
              Are you sure you want to delete this video? This action may
              permanently remove it from your collection.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setConfirmDelete(false)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteBtn;
