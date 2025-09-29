import React from "react";
import { AiFillStar } from "react-icons/ai";

function buildGmapsSearchUrl(name = "", address = "") {
  const q = encodeURIComponent([name, address].filter(Boolean).join(" "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function Hotels({ hotels = [], location = "" }) {
  if (!hotels.length) return null;

  return (
    <div className="p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Hotel Recommendations</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {hotels.map((hotel, index) => {
          const mapHref = buildGmapsSearchUrl(hotel.name, hotel.address || location);
          return (
            <a
              key={`${hotel.name || "hotel"}-${index}`}
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all"
              title="Open in Google Maps"
            >
              <div className="p-3">
                {hotel.imageUrl ? (
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-32 rounded-lg mb-3 bg-gradient-to-br from-blue-50 to-emerald-50 border border-dashed" />
                )}

                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 leading-snug">
                    {hotel.name || "Hotel"}
                  </div>
                  {hotel.address && (
                    <div className="text-xs text-gray-600">📍 {hotel.address}</div>
                  )}

                  <div className="flex items-center justify-between mt-1">
                    {hotel.price ? (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {hotel.price}
                      </span>
                    ) : <span />}

                    {hotel.rating ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                        <AiFillStar className="shrink-0" /> {hotel.rating}
                      </span>
                    ) : null}
                  </div>

                  {hotel.description && (
                    <p className="text-xs text-gray-600 mt-2">
                      {hotel.description}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
