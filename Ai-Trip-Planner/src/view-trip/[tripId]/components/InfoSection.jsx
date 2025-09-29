import React from "react";

export default function InfoSection({ meta }) {
  const { location, duration, budget, travelers, bestTimeToVisit } = meta || {};

  return (
    <div className="relative">
      {/* banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200">
        <img
          src="https://images.unsplash.com/photo-1542317853-0e4fd0d1a494?q=80&w=2000&auto=format&fit=crop"
          alt="Destination banner"
          className="h-[320px] w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* title + chips */}
      <div className="mt-5">
        <h2 className="text-2xl font-extrabold text-gray-900">
          {location ? `Location: ${location}` : "Your Trip"}
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {duration && (
            <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm">
              {duration} ✈️
            </span>
          )}
          {budget && (
            <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm">
              Budget: {budget} 💰
            </span>
          )}
          {travelers && (
            <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-sm">
              For {travelers}
            </span>
          )}
          {bestTimeToVisit && (
            <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-sm">
              Best time: {bestTimeToVisit}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
