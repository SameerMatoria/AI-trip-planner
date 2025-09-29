import React from "react";

const budgetOptions = ["Cheap", "Moderate", "Luxury"];

export default function FiltersBar({
  search,
  setSearch,
  selectedBudget,
  setSelectedBudget,
  sort,
  setSort,
  totalCount,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 md:p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">My Itineraries</span>
          {typeof totalCount === "number" && (
            <span className="rounded-full border px-2 py-0.5 bg-white text-gray-900">{totalCount}</span>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          {/* Search */}
          <div className="relative">
            <input
              className="w-full md:w-72 rounded-xl border border-gray-200 bg-white px-9 py-2 text-sm placeholder:text-gray-400"
              placeholder="Search by destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-2 px-2 text-gray-400 hover:text-gray-600"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>

          {/* Budget chips */}
          <div className="flex flex-wrap gap-2">
            {budgetOptions.map((b) => {
              const active = selectedBudget === b;
              const colors =
                b === "Cheap"
                  ? active
                    ? "bg-white text-white"
                    : "bg-white text-black border-gray-200"
                  : b === "Moderate"
                  ? active
                    ? "bg-white text-white"
                    : "bg-white text-black border-gray-200"
                  : active
                  ? "bg-white text-white"
                  : "bg-white text-black border-gray-200"
              return (
                <button
                  key={b}
                  onClick={() => setSelectedBudget(active ? null : b)}
                  className={`text-sm rounded-full border px-3 py-1 transition ${colors}`}
                >
                  {b}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <select
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="destination-asc">Destination A→Z</option>
            <option value="destination-desc">Destination Z→A</option>
            <option value="days-asc">Days ↑</option>
            <option value="days-desc">Days ↓</option>
          </select>
        </div>
      </div>
    </div>
  );
}
