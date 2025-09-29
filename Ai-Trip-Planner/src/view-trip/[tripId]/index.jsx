import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "./components/InfoSection";
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import { HiOutlineArrowLeft, HiOutlineClipboardCopy, HiOutlinePrinter } from "react-icons/hi";

// --- helpers ---
function parseMaybeJson(x) {
  if (x == null) return null;
  if (typeof x === "object") return x;
  if (typeof x === "string") {
    const s = x.trim().replace(/^```json\s*/i, "").replace(/```$/i, "");
    try { return JSON.parse(s); } catch { return x; }
  }
  return x;
}
function toPlaceArray(items) {
  if (!items) return [];
  if (Array.isArray(items)) return items;
  if (typeof items === "object") {
    const hasPlaceFields =
      "placeName" in items || "place_name" in items ||
      "placeDetails" in items || "place_details" in items;
    if (hasPlaceFields) return [items];
    const vals = Object.values(items);
    const looksLikePlaces =
      vals.length > 0 &&
      typeof vals[0] === "object" &&
      ("placeName" in vals[0] || "place_name" in vals[0] ||
       "placeDetails" in vals[0] || "place_details" in vals[0]);
    if (looksLikePlaces) return vals;
    return [];
  }
  return [];
}
function coalesce(...vals) { for (const v of vals) if (v != null && v !== "") return v; return ""; }

const Chip = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700">
    {children}
  </span>
);

export default function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tripId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const snap = await getDoc(doc(db, "AITrips", tripId));
        if (!cancelled) {
          if (snap.exists()) setTrip(snap.data());
          else setErr("No such trip found.");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setErr("Failed to load trip.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tripId]);

  // ---------- normalize ----------
  const normalized = useMemo(() => {
    if (!trip) return null;
    const userSel = trip.userSelection || {};
    const td = parseMaybeJson(trip.tripData) || {};
    const plan = td.trip_plan || td.tripPlan || {};

    const location = coalesce(
      userSel.location?.label, userSel.location, plan.location, plan.destination, ""
    );
    const duration = coalesce(plan.duration, userSel.noOfDays ? `${userSel.noOfDays} days` : "");
    const travelers = coalesce(plan.travelers, userSel.traveler, "");
    const budget = coalesce(plan.budget, userSel.budget, "");
    const bestTimeToVisit = coalesce(plan.bestTimeToVisit, plan.best_time_to_visit, "");

    const hotelsRaw = Array.isArray(plan.hotels) ? plan.hotels : [];
    const hotels = hotelsRaw.map((h) => ({
      name: h.name || h.hotelName || "",
      address: h.address || h.hotelAddress || "",
      price: h.price || "",
      rating: h.rating || "",
      imageUrl: h.image_url || h.hotelImageUrl || "",
      description: h.description || "",
      geoCoordinates: h.geoCoordinates || h.geo_coordinates || "",
    }));

    let itinerary = [];
    if (Array.isArray(plan.itinerary)) {
      const byDay = {};
      for (const it of plan.itinerary) {
        const dayLabel = it.day || "Day";
        (byDay[dayLabel] ||= []).push(it);
      }
      itinerary = Object.entries(byDay).map(([dayLabel, items]) => ({
        dayLabel,
        items: items.map((i) => ({
          placeName: i.placeName || i.place_name || "",
          placeDetails: i.placeDetails || i.place_details || "",
          rating: i.rating || "",
          time: i.time || i.timeTravel || i.time_to_travel || i.timeToTravel || "",
          ticketPricing: i.ticketPricing || i.ticket_pricing || "",
          placeImageUrl: i.placeImageUrl || i.place_image_url || "",
          geoCoordinates: i.geoCoordinates || i.geo_coordinates || "",
        })),
      }));
    } else if (plan.itinerary && typeof plan.itinerary === "object") {
      const entries = Object.entries(plan.itinerary);
      entries.sort(([a], [b]) => {
        const na = parseInt(a.replace(/\D/g, ""), 10);
        const nb = parseInt(b.replace(/\D/g, ""), 10);
        return Number.isNaN(na) || Number.isNaN(nb) ? a.localeCompare(b) : na - nb;
      });
      itinerary = entries.map(([dayKey, itemsVal]) => ({
        dayLabel: dayKey.replace(/day/i, "Day ").replace(/\s+/, " ").trim(),
        items: toPlaceArray(itemsVal).map((i) => ({
          placeName: i.placeName || i.place_name || "",
          placeDetails: i.placeDetails || i.place_details || "",
          rating: i.rating || "",
          time: i.time || i.timeTravel || i.time_to_travel || i.timeToTravel || "",
          ticketPricing: i.ticketPricing || i.ticket_pricing || "",
          placeImageUrl: i.placeImageUrl || i.place_image_url || "",
          geoCoordinates: i.geoCoordinates || i.geo_coordinates || "",
        })),
      }));
    }

    return { meta: { location, duration, travelers, budget, bestTimeToVisit }, hotels, itinerary };
  }, [trip]);

  // ---------- ui states ----------
  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="h-40 rounded-2xl bg-[linear-gradient(90deg,#f3f4f6,40%,#e5e7eb,60%,#f3f4f6)] bg-[length:200%_100%] animate-[shimmer_1.2s_infinite]" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-[linear-gradient(90deg,#f3f4f6,40%,#e5e7eb,60%,#f3f4f6)] bg-[length:200%_100%] animate-[shimmer_1.2s_infinite]" />
            ))}
          </div>
        </div>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      </div>
    );
  }
  if (err) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <div className="max-w-xl w-full text-center">
          <h2 className="text-2xl font-semibold">Oops</h2>
          <p className="text-gray-600 mt-2">{err}</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/create-trip" className="rounded-lg border px-4 py-2 hover:bg-gray-50">
              <span className="inline-flex items-center gap-2">
                <HiOutlineArrowLeft /> Create another trip
              </span>
            </Link>
            <button onClick={() => window.location.reload()} className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!normalized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-5">
        <p className="text-gray-600">Nothing to show.</p>
      </div>
    );
  }

  const { meta, itinerary, hotels } = normalized;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="pb-16">
      {/* sticky toolbar */}
      <div className="sticky top-0 z-30 border-b border-gray-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-6xl px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Link to="/create-trip" className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
              <HiOutlineArrowLeft /> Back
            </Link>
            {meta.location && <Chip>📍 {meta.location}</Chip>}
            {meta.duration && <Chip>🗓️ {meta.duration}</Chip>}
            {meta.travelers && <Chip>👥 {meta.travelers}</Chip>}
            {meta.budget && <Chip>💰 {meta.budget}</Chip>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white hover:bg-gray-50">
              <HiOutlineClipboardCopy /> {copied ? "Copied!" : "Copy Link"}
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-3 py-1.5 text-sm hover:bg-black">
              <HiOutlinePrinter /> Export
            </button>
          </div>
        </div>
      </div>

      {/* hero */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl px-5 pt-10">
          <InfoSection meta={meta} />
        </div>

        {/* day navigation chips */}
        {itinerary?.length > 0 && (
          <div className="mx-auto max-w-6xl px-5 pt-4 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {itinerary.map((d, i) => {
                const anchor = `day-${(d.dayLabel || `day-${i+1}`)}`.replace(/\s+/g, "-").toLowerCase();
                return (
                  <a key={anchor} href={`#${anchor}`} className="text-xs sm:text-sm rounded-full border border-gray-200 bg-white px-3 py-1.5 hover:bg-gray-50">
                    {d.dayLabel || `Day ${i + 1}`}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* main content */}
      <div className="mx-auto max-w-6xl px-5 mt-10 space-y-12">
        {/* Hotels */}
        <section aria-labelledby="hotels-heading">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 id="hotels-heading" className="text-xl font-semibold">Recommended Hotels</h2>
            {meta.location && <span className="text-xs text-gray-500">in {meta.location}</span>}
          </div>
          {hotels?.length ? (
            <div className="rounded-2xl border border-gray-200 bg-white">
              <Hotels hotels={hotels} location={meta.location} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <div className="text-base font-semibold text-gray-900">No hotels provided</div>
              <div className="mt-1 text-sm text-gray-600">This trip doesn’t include hotel suggestions. You can still use the itinerary below.</div>
            </div>
          )}
        </section>

        {/* Itinerary */}
        <section aria-labelledby="itinerary-heading">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 id="itinerary-heading" className="text-xl font-semibold">Places to Visit</h2>
            <span className="text-xs text-gray-500">{itinerary?.length || 0} {itinerary?.length === 1 ? "day" : "days"}</span>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white">
            {/* PlacesToVisit now renders days (no extra top-level title to avoid duplicates) */}
            <PlacesToVisit itinerary={itinerary} />
          </div>
        </section>
      </div>

      {/* utils */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print { .sticky { position: static !important } a[href]:after{content:"" !important} }
      `}</style>
    </div>
  );
}
