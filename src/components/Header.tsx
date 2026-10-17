"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home,
  User,
  Upload,
  LogIn,
  LogOut,
  ChevronDown,
  CircleUserRound,
} from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  const username = session?.user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/85 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          prefetch
          onClick={() =>
            showNotification("Welcome to ImageKit ReelsPro", "info")
          }
          className="group flex items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-600/15 text-blue-400 transition duration-300 group-hover:border-blue-400/40 group-hover:bg-blue-600/25">
            <Home className="h-5 w-5" />
          </span>

          <span className="text-lg font-semibold tracking-tight text-white sm:text-xl">
            Reel <span className="text-blue-400">Flow</span>
          </span>
        </Link>

        {/* Right-side actions */}
        <div className="flex items-center gap-3">
          {session && (
            <Link
              href="/upload"
              onClick={() =>
                showNotification("Welcome to Admin Dashboard", "info")
              }
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-white sm:inline-flex"
            >
              <Upload className="h-4 w-4 text-blue-400" />
              Upload Video
            </Link>
          )}

          {/* User dropdown */}
          <div className="dropdown dropdown-end">
            <button
              type="button"
              tabIndex={0}
              aria-label="Open account menu"
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 transition hover:border-blue-500/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-600/15 text-blue-400">
                <User className="h-5 w-5" />
              </span>

              <span className="hidden max-w-32 truncate text-sm font-medium text-gray-200 md:block">
                {username || "My Account"}
              </span>

              <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
            </button>

            <ul
              tabIndex={0}
              role="menu"
              className="menu dropdown-content z-50 mt-3 w-64 gap-1 rounded-2xl border border-white/10 bg-[#0b1120] p-2 text-gray-300 shadow-2xl shadow-black/40"
            >
              {session ? (
                <>
                  {/* Account details */}
                  <li className="pointer-events-none mb-1">
                    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3 hover:bg-white/[0.04]">
                      <CircleUserRound className="h-8 w-8 shrink-0 text-blue-400" />

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          Signed in as
                        </p>
                        <p className="truncate text-sm font-medium text-white">
                          {username || "User"}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <Link
                      href="/profile"
                      role="menuitem"
                      className="gap-3 rounded-xl px-3 py-2.5 transition hover:bg-blue-500/10 hover:text-blue-300"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/upload"
                      role="menuitem"
                      className="gap-3 rounded-xl px-3 py-2.5 transition hover:bg-blue-500/10 hover:text-blue-300 sm:hidden"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </Link>
                  </li>

                  <li className="my-1 border-t border-white/10 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full gap-3 rounded-xl px-3 py-2.5 text-left text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    role="menuitem"
                    onClick={() =>
                      showNotification(
                        "Please sign in to continue",
                        "info"
                      )
                    }
                    className="gap-3 rounded-xl px-3 py-3 transition hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <LogIn className="h-4 w-4 text-blue-400" />
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
