import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { downloadJson } from "@/service/firestoreTrips";

function fmtDate(ts) {
  if (!ts) return "";
  try {
    const d = ts?.toDate?.() instanceof Date
      ? ts.toDate()
      : new Date(typeof ts === "string" ? ts : ts?._seconds * 1000);
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function TripCard({ trip, onDelete, onRename, onDuplicate }) {
  const { id, userSelection = {}, tripData = {}, createdAt } = trip || {};
  const { location, noOfDays, budget, traveler, customTitle } = userSelection;

  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const loc = useLocation();

  // close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  const displayTitle =
    customTitle ||
    location ||
    tripData?.destination ||
    tripData?.trip_plan?.destination ||
    "Trip";

  const days =
    noOfDays ||
    tripData?.totalDays ||
    tripData?.trip_plan?.duration?.replace(/\D/g, "") ||
    "";

  const handleDownload = () => {
    const filename = `${displayTitle?.toString().replace(/\s+/g, "_") || "trip"}_${id}.json`;
    downloadJson(filename, { id, ...trip });
  };

  // budget pill colors (purely visual)
  const budgetPill =
    (budget || "").toLowerCase().includes("lux")
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : (budget || "").toLowerCase().includes("mod")
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : (budget || "").toLowerCase().includes("cheap")
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <article
      ref={boxRef}
      className={`group relative overflow-visible isolate rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition ${open ? "z-50" : "z-0"
        }`}
    >
      {/* header banner */}
      <div className="h-20 bg-gradient-to-r from-blue-50 via-white to-emerald-50" />

      <div className="p-4 -mt-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* avatar circle (destination initial) */}
            <div className="shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white grid place-items-center">
              {String(displayTitle).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-snug">{displayTitle}</h3>
              <p className="text-sm text-gray-600">
                {days ? `${days} day(s)` : ""}{budget ? ` • ${budget}` : ""}{traveler ? ` • ${traveler}` : ""}
              </p>
              {createdAt && (
                <p className="text-xs text-gray-500 mt-1">Created: {fmtDate(createdAt)}</p>
              )}
            </div>
          </div>

          {/* kebab */}
          <div className="relative">
            <button
              type="button"
              className="rounded-lg border px-2 py-1 text-sm bg-white hover:bg-gray-50"
              onClick={() => setOpen((s) => !s)}
              aria-haspopup="menu"
              aria-expanded={open}
              title="More actions"
            >
              ⋯
            </button>

            {open && (
              <div
                className="absolute right-0 z-[1000] mt-2 w-44 rounded-lg bg-white text-gray-700 shadow-xl ring-1 ring-black/5"
                role="menu"
              >
                <ul className="py-1 text-sm">
                  <li>
                    <Link
                      to={`/view-trip/${id}`}
                      className="block px-3 py-2 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      View
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="block w-full bg-transparent text-left px-3 py-2 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        onRename?.(id, displayTitle);
                      }}
                    >
                      Rename
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="block w-full bg-transparent text-left px-3 py-2 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={async () => {
                        setOpen(false);
                        await onDuplicate?.(id);
                      }}
                    >
                      Duplicate
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="block w-full bg-transparent text-left px-3 py-2 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        handleDownload();
                      }}
                    >
                      Download JSON
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="block w-full bg-transparent text-left px-3 py-2 text-red-600 hover:bg-red-50"
                      role="menuitem"
                      onClick={() => {
                        setOpen(false);
                        onDelete?.(id);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* quick pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {budget && (
            <span className={`px-2 py-0.5 rounded-full border text-xs ${budgetPill}`}>💰 {budget}</span>
          )}
          {traveler && (
            <span className="px-2 py-0.5 rounded-full border text-xs bg-amber-50 text-amber-700 border-amber-200">
              👥 {traveler}
            </span>
          )}
        </div>

        {/* description */}
        <p className="mt-3 text-sm text-gray-700 line-clamp-3">
          {tripData?.overview?.description ||
            tripData?.trip_plan?.overview?.description ||
            "AI-generated itinerary."}
        </p>

        <div className="mt-4">
          <Link
            to={`/view-trip/${id}`}
            className="inline-block px-3 py-1.5 rounded-xl bg-gray-900 text-white text-sm hover:bg-black"
          >
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}
