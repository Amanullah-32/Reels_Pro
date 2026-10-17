
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import VideoUploadForm from "@/components/VideoUploadForm";
import {Clapperboard, ShieldCheck } from "lucide-react";

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectToDB();

  return (
    <main className="min-h-screen bg-[#070b14] px-4 pb-16 pt-6 text-white sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-3xl">

        <div className="mt-7 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20 backdrop-blur-xl sm:mt-9">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-8 sm:px-9 sm:py-10">
            <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-600/15 text-blue-400">
                <Clapperboard className="h-6 w-6" />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  Creator Studio
                </p>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Upload a new video
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-6 text-gray-400">
                  Add your title and description, upload your video,
                  and share it with your ReelFlow audience.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-9">
            <VideoUploadForm />
          </div>

          <div className="flex items-start gap-3 border-t border-white/10 bg-white/[0.02] px-6 py-4 sm:px-9">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />

            <p className="text-xs leading-5 text-gray-500">
              Your upload is processed through ImageKit. Only publish
              content you have the right to share.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          ReelFlow Creator Studio · Create. Upload. Share.
        </p>
      </div>
    </main>
  );
}
