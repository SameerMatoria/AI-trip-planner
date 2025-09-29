import React, { useEffect, useMemo, useState } from "react";
import useGoogleAuth from "@/service/useGoogleAuth";
import {
  getUserTrips,
  deleteTrip,
  renameTrip,
  duplicateTrip,
  getTripById,
} from "@/service/firestoreTrips";
import TripCard from "./TripCard";
import FiltersBar from "./FiltersBar";
import RenameDialog from "./RenameDialog";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useGoogleAuth();
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [sort, setSort] = useState("newest");

  const [renamingId, setRenamingId] = useState(null);
  const [renameInitial, setRenameInitial] = useState("");

  const pageSize = 18;

  useEffect(() => {
    const run = async () => {
      if (!user?.email) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { items: page } = await getUserTrips(user.email, 200);
        setItems(page);
        setHasMore(false); // no pagination
        setCursor(null);
      } catch (e) {
        console.error("Dashboard load error:", e);
        toast("Failed to load your itineraries.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user?.email]);

  const loadMore = async () => {
    if (!hasMore || !cursor || !user?.email) return;
    setMoreLoading(true);
    try {
      const { items: page, nextCursor } = await getUserTrips(user.email, pageSize, cursor);
      setItems((prev) => [...prev, ...page]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } finally {
      setMoreLoading(false);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this itinerary?");
    if (!ok) return;
    try {
      await deleteTrip(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast("Trip deleted.");
    } catch {
      toast("Delete failed.");
    }
  };

  const onRename = async (id, current) => {
    setRenamingId(id);
    setRenameInitial(current || "");
  };

  const handleRenameSubmit = async (newTitle) => {
    try {
      await renameTrip(renamingId, newTitle);
      setItems((prev) =>
        prev.map((t) =>
          t.id === renamingId
            ? { ...t, userSelection: { ...(t.userSelection || {}), customTitle: newTitle } }
            : t
        )
      );
      toast("Renamed.");
    } catch {
      toast("Rename failed.");
    } finally {
      setRenamingId(null);
    }
  };

  const onDuplicate = async (id) => {
    try {
      const newId = await duplicateTrip(id);
      const newDoc = await getTripById(newId);
      setItems((prev) => [newDoc, ...prev]);
      toast("Duplicated.");
    } catch {
      toast("Duplicate failed.");
    }
  };

  const derived = useMemo(() => {
    const term = search.trim().toLowerCase();
    let arr = [...items];

    if (term) {
      arr = arr.filter((t) => {
        const sel = t.userSelection || {};
        const td = t.tripData || {};
        const dest = sel.location || td.destination || td?.trip_plan?.destination || "";
        return dest.toString().toLowerCase().includes(term);
      });
    }

    if (selectedBudget) {
      arr = arr.filter((t) => {
        const b =
          t?.userSelection?.budget ||
          t?.tripData?.budget ||
          t?.tripData?.trip_plan?.budget ||
          "";
        return b.toString().toLowerCase().includes(selectedBudget.toLowerCase());
      });
    }

    const parseDays = (t) => {
      const d1 = t?.userSelection?.noOfDays;
      const d2 = t?.tripData?.totalDays;
      const d3 = t?.tripData?.trip_plan?.duration?.match(/\d+/)?.[0];
      const n = Number(d1 || d2 || d3 || 0);
      return Number.isFinite(n) ? n : 0;
    };

    const getDest = (t) =>
      (t?.userSelection?.location ||
        t?.tripData?.destination ||
        t?.tripData?.trip_plan?.destination ||
        "").toString();

    if (sort === "newest") {
      arr.sort((a, b) => {
        const ta = a?.createdAt?.toMillis?.() ?? Number(a.id || 0);
        const tb = b?.createdAt?.toMillis?.() ?? Number(b.id || 0);
        return tb - ta;
      });
    } else if (sort === "oldest") {
      arr.sort((a, b) => {
        const ta = a?.createdAt?.toMillis?.() ?? Number(a.id || 0);
        const tb = b?.createdAt?.toMillis?.() ?? Number(b.id || 0);
        return ta - tb;
      });
    } else if (sort === "destination-asc") {
      arr.sort((a, b) => getDest(a).localeCompare(getDest(b)));
    } else if (sort === "destination-desc") {
      arr.sort((a, b) => getDest(b).localeCompare(getDest(a)));
    } else if (sort === "days-asc") {
      arr.sort((a, b) => parseDays(a) - parseDays(b));
    } else if (sort === "days-desc") {
      arr.sort((a, b) => parseDays(b) - parseDays(a));
    }

    return arr;
  }, [items, search, selectedBudget, sort]);

  if (!user?.email) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="px-5 sm:px-10 md:px-32 lg:px-36 xl:px-72 pt-12">
          <h2 className="text-2xl font-bold tracking-tight">My Itineraries</h2>
          <p className="text-gray-600 mt-2">Please sign in to see your itineraries.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Frosted header */}
      <div className="sticky top-0 z-20 border-b border-gray-200/70 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="px-5 sm:px-10 md:px-20 xl:px-40 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">My Itineraries</h1>
              <p className="text-sm text-gray-600">All your AI-generated trips in one place.</p>
            </div>
            {typeof items.length === "number" && (
              <span className="hidden sm:inline-flex items-center rounded-full border px-3 py-1 text-sm bg-white">
                {items.length} total
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 md:px-20 xl:px-40 pt-6 pb-16">
        <FiltersBar
          search={search}
          setSearch={setSearch}
          selectedBudget={selectedBudget}
          setSelectedBudget={setSelectedBudget}
          sort={sort}
          setSort={setSort}
          totalCount={items.length}
        />

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-[linear-gradient(90deg,#f3f4f6,40%,#e5e7eb,60%,#f3f4f6)] bg-[length:200%_100%] animate-[shimmer_1.2s_infinite]"
              />
            ))}
          </div>
        ) : derived.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-10 text-center">
            <div className="text-lg font-semibold text-gray-900">No trips match your filters</div>
            <p className="text-gray-600 text-sm mt-1">
              Try clearing the search or selecting a different budget.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {derived.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={onDelete}
                  onRename={onRename}
                  onDuplicate={onDuplicate}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={moreLoading}
                  className="px-5 py-2 rounded-xl font-semibold bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                >
                  {moreLoading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}

        <RenameDialog
          open={!!renamingId}
          initial={renameInitial}
          onClose={() => setRenamingId(null)}
          onSubmit={handleRenameSubmit}
        />
      </div>

      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}
