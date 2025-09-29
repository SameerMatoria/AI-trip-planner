import React from "react";

function buildGmapsSearchUrl(query = "") {
  const q = encodeURIComponent(query);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function PlacesToVisit({ itinerary = [] }) {
  if (!Array.isArray(itinerary) || !itinerary.length) return null;

  return (
    <div className="p-5">
      {/* no top-level “Places to Visit” title here to avoid duplication;
          the page (Viewtrip) renders the section title. */}
      <div className="flex flex-col space-y-10">
        {itinerary.map((day, i) => {
          const anchor = `day-${(day.dayLabel || `day-${i+1}`)}`.replace(/\s+/g, "-").toLowerCase();
          return (
            <div key={anchor} id={anchor} className="scroll-mt-24">
              <div className="mb-3">
                <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 text-emerald-800 px-3 py-1 text-xs font-semibold border border-emerald-200">
                  {day.dayLabel || `Day ${i + 1}`}
                </span>
              </div>

              <div className="space-y-4">
                {day.items.map((item, idx) => (
                  <div
                    key={`${item.placeName || "place"}-${idx}`}
                    className="flex flex-col md:flex-row md:items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-all"
                  >
                    {/* text */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-base font-semibold text-gray-900">
                          {item.placeName}
                        </h4>
                        {item.placeName && (
                          <a
                            href={buildGmapsSearchUrl(item.placeName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs rounded-lg border px-2 py-1 hover:bg-gray-50"
                          >
                            Open in Maps
                          </a>
                        )}
                      </div>

                      {item.placeDetails && (
                        <p className="text-sm text-gray-700 mt-1">{item.placeDetails}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-2">
                        {item.rating && (
                          <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            ⭐ {item.rating}
                          </span>
                        )}
                        {item.time && (
                          <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            ⏱ {item.time}
                          </span>
                        )}
                        {item.ticketPricing && (
                          <span className="px-2 py-1 rounded bg-violet-50 text-violet-700 border border-violet-200">
                            🎟 {item.ticketPricing}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* image */}
                    {item.placeImageUrl ? (
                      <img
                        src={item.placeImageUrl}
                        alt={item.placeName}
                        className="w-full md:w-64 h-40 object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full md:w-64 h-40 rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 border border-dashed" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
