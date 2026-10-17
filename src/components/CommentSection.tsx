"use client";

import React, { useState } from "react";
import {
  SendHorizontal,
  MessageCircle,
  Trash2,
  Loader2,
  UserRound,
  AlertCircle,
} from "lucide-react";

interface IComment {
  _id: string;
  user: string;
  text: string;
  createdAt?: string;
}

interface IUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface CommentSectionProps {
  reelId: string;
  initialComment: IComment[];
  user: IUser;
}

const CommentSection = ({
  reelId,
  initialComment,
  user,
}: CommentSectionProps) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<IComment[]>(initialComment);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || posting) return;

    setPosting(true);
    setError("");

    try {
      const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelId,
          text: trimmedText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post your comment.");
      }

      if (data.comment?.comments) {
        setComments(data.comment.comments);
        setText("");
      } else {
        throw new Error("Unexpected response from the server.");
      }
    } catch (err) {
      console.error("Failed to comment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (deletingId) return;

    setDeletingId(commentId);
    setError("");

    try {
      const response = await fetch("/api/comment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelId, commentId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to delete the comment.");
      }

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getInitial = (commentUser: string) =>
    commentUser?.trim().charAt(0).toUpperCase() || "U";

  return (
    <section className="w-full min-w-0 text-white">
      {/* Heading */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <MessageCircle className="h-5 w-5 text-blue-400" />
            Comments
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Join the conversation and share your thoughts.
          </p>
        </div>

        <span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 px-2 text-xs font-semibold text-blue-300">
          {comments.length}
        </span>
      </div>

      {/* Comment composer */}
      <form onSubmit={handleComment} className="mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition focus-within:border-blue-500/40 focus-within:bg-white/[0.04]">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-4 w-4" />
              )}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something thoughtful..."
              aria-label="Write a comment"
              maxLength={1000}
              rows={3}
              className="min-h-20 w-full resize-y bg-transparent py-1 text-sm leading-6 text-white outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-3">
            <span className="text-xs text-gray-500">
              {text.length}/1000
            </span>

            <button
              type="submit"
              disabled={!text.trim() || posting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              {posting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  Post comment
                  <SendHorizontal className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Comment list */}
      <div className="space-y-3">
        {comments.length > 0 ? (
          comments.map((comment) => {
            const isCommentOwner = user.id === comment.user;

            return (
              <article
                key={comment._id}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-gray-300">
                    {getInitial(comment.user)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="break-all text-sm font-medium text-gray-200">
                        {isCommentOwner
                          ? "You"
                          : `User ${comment.user.slice(-6)}`}
                      </p>

                      {isCommentOwner && (
                        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                          Your comment
                        </span>
                      )}
                    </div>

                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-400">
                      {comment.text}
                    </p>

                    {comment.createdAt && (
                      <p className="mt-2 text-xs text-gray-600">
                        {new Date(comment.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    )}

                    {isCommentOwner && (
                      <button
                        type="button"
                        onClick={() => deleteComment(comment._id)}
                        disabled={deletingId !== null}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/[0.04] px-2.5 py-1.5 text-xs font-medium text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === comment._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}

                        {deletingId === comment._id
                          ? "Deleting..."
                          : "Delete comment"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-4 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/[0.06] text-blue-400">
              <MessageCircle className="h-5 w-5" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-200">
              No comments yet
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Be the first to share your thoughts on this video.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
