import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GoogleMap from "../../GoogleMap";
import { searchIP } from "../../../api/ipApi";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [sortBy, setSortBy] = useState("relevance");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API Data
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const query = searchParams.get("keyword");
  const type = searchParams.get("type") || "PATENT";
  const source = searchParams.get("source") || "EXTERNAL";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await searchIP({
          query,
          type,
          source,
        });

        const normalized = Array.isArray(data)
          ? data.map((item, index) => ({
            id: item.id ?? `${item.number}-${index}`,
            title: item.title,
            number: item.applicationNumber || "N/A",
            assignee: item.ownerName || "Unknown",
            inventor: item.inventorName || null,
            jurisdiction: item.country || "Unknown",
            date: item.filingDate || "N/A",
            status: item.legalStatus || "Unknown",
            abstract: item.abstractText || "",
            // Add date fields for IPDetails
            filingDate: item.filingDate,
            publicationDate: item.publicationDate,
            grantDate: item.grantDate,
            priorityDate: item.priorityDate,
            legalStatus: item.legalStatus,
            assetType: item.assetType,
            abstractText: item.abstractText,
            ownerName: item.ownerName,
            inventorName: item.inventorName,
            referenceSource: item.referenceSource,
            patentLink: item.patentLink,
            pdfLink: item.pdfLink,
            thumbnail: item.thumbnail,
          }))
          : [];

        setResults(normalized);
        setTotalResults(normalized.length);

        // 🔴 ADD THESE
        setCurrentPage(1);
        setFilterStatus("");
        setSortBy("relevance");

        console.log("Normalized results:", normalized);

      } catch (err) {
        console.error(err);
        setError("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type, source]);

  // Apply filters and sorting
  const getFilteredResults = () => {
    let filtered = [...results];

    const assigneeFilter = searchParams.get("assignee");
    if (assigneeFilter) {
      filtered = filtered.filter((r) =>
        r.assignee?.toLowerCase().includes(assigneeFilter.toLowerCase())
      );
    }


    const inventorFilter = searchParams.get("inventor");
    if (inventorFilter && searchParams.get("type")?.toUpperCase() === "PATENT"
    ) {
      filtered = filtered.filter(
        (r) =>
          r.inventor &&
          r.inventor.toLowerCase().includes(inventorFilter.toLowerCase())
      );
    }

    const jurisdictionFilter = searchParams.get("jurisdiction");
    if (jurisdictionFilter) {
      filtered = filtered.filter((r) => r.jurisdiction === jurisdictionFilter);
    }

    if (filterStatus) {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date) - new Date(a.date);
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredResults = React.useMemo(() => {
    return getFilteredResults();
  }, [results, sortBy, filterStatus, searchParams]);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("SEARCH PARAMS", {
    keyword: searchParams.get("keyword"),
    type: searchParams.get("type"),
    source: searchParams.get("source"),
  });

  console.log("filtered length", filteredResults.length);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate("/ip-search")}
              className="flex items-center text-white hover:text-blue-300 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              New Search
            </button>
            <h1 className="text-xl font-bold text-white">
              {filteredResults.length} Results for "
              {searchParams.get("keyword") || "All"}"
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300"
                  }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "map"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300"
                  }`}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-white text-sm mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 bg-white/10 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="relevance" className="bg-slate-800">
                      Relevance
                    </option>
                    <option value="date-desc" className="bg-slate-800">
                      Newest First
                    </option>
                    <option value="date-asc" className="bg-slate-800">
                      Oldest First
                    </option>
                    <option value="title" className="bg-slate-800">
                      Title A-Z
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-white text-sm mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 bg-white/10 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="" className="bg-slate-800">
                      All Statuses
                    </option>
                    <option value="Granted" className="bg-slate-800">
                      Granted
                    </option>
                    <option value="Pending" className="bg-slate-800">
                      Pending
                    </option>
                    <option value="Active" className="bg-slate-800">
                      Active
                    </option>
                    <option value="Expired" className="bg-slate-800">
                      Expired
                    </option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSortBy("relevance");
                    setFilterStatus("");
                  }}
                  className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="text-white text-sm font-semibold mb-2">
                  Search Summary
                </h4>
                <div className="space-y-2 text-xs text-gray-300">
                  <p>
                    Type:{" "}
                    <span className="text-white">
                      {searchParams.get("type") || "All"}
                    </span>
                  </p>
                  <p>
                    Keyword:{" "}
                    <span className="text-white">
                      {searchParams.get("keyword") || "N/A"}
                    </span>
                  </p>
                  {searchParams.get("jurisdiction") && (
                    <p>
                      Jurisdiction:{" "}
                      <span className="text-white">
                        {searchParams.get("jurisdiction")}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {viewMode === "list" ? (
              <div className="space-y-4">
                {paginatedResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {result.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {result.number}
                          </span>
                          <span
                            className={`px-2 py-1 rounded text-xs ${result.status === "Granted" ||
                                result.status === "Active"
                                ? "bg-green-500/20 text-green-300"
                                : result.status === "Pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                          >
                            {result.status}
                          </span>
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {result.jurisdiction}
                          </span>
                        </div>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="text-sm text-gray-300 space-y-1 mb-3">
                      <p>
                        <span className="text-gray-400">Assignee:</span>{" "}
                        {result.assignee}
                      </p>
                      {result.inventor && (
                        <p>
                          <span className="text-gray-400">Inventor:</span>{" "}
                          {result.inventor}
                        </p>
                      )}
                      <p>
                        <span className="text-gray-400">Date:</span>{" "}
                        {result.date}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-2">
                      {result.abstract}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                        onClick={() =>
                          navigate(`/ip/${result.id}`, {
                            state: { ip: result },
                          })
                        }
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">
                        Download PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <MapView
                results={filteredResults}
                searchType={searchParams.get("type")}
              />
            )}

            {/* Pagination */}
            {viewMode === "list" && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// MapView Component
const MapView = ({ results, searchType }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [expandedMarker, setExpandedMarker] = useState(null);

  // Group results by jurisdiction
  const groupedByJurisdiction = results.reduce((acc, result) => {
    if (!acc[result.jurisdiction]) {
      acc[result.jurisdiction] = [];
    }
    acc[result.jurisdiction].push(result);
    return acc;
  }, {});

  // Map coordinates for different jurisdictions (real lat/lng used for markers)
  const jurisdictionCoordinates = {
    "United States": { lat: 37.0902, lng: -95.7129 },
    US: { lat: 37.0902, lng: -95.7129 },
    "European Union": { lat: 50.1109, lng: 8.6821 },
    EP: { lat: 50.1109, lng: 8.6821 },
    EU: { lat: 50.1109, lng: 8.6821 },
    China: { lat: 35.8617, lng: 104.1954 },
    CN: { lat: 35.8617, lng: 104.1954 },
    Japan: { lat: 36.2048, lng: 138.2529 },
    JP: { lat: 36.2048, lng: 138.2529 },
    "South Korea": { lat: 36.5, lng: 127.5 },
    KR: { lat: 36.5, lng: 127.5 },
    India: { lat: 20.5937, lng: 78.9629 },
    IN: { lat: 20.5937, lng: 78.9629 },
    Canada: { lat: 56.1304, lng: -106.3468 },
    CA: { lat: 56.1304, lng: -106.3468 },
    Australia: { lat: -25.2744, lng: 133.7751 },
    AU: { lat: -25.2744, lng: 133.7751 },
    "United Kingdom": { lat: 55.3781, lng: -3.436 },
    GB: { lat: 55.3781, lng: -3.436 },
    UK: { lat: 55.3781, lng: -3.436 },
    Germany: { lat: 51.1657, lng: 10.4515 },
    DE: { lat: 51.1657, lng: 10.4515 },
    Switzerland: { lat: 46.8182, lng: 8.2275 },
    CH: { lat: 46.8182, lng: 8.2275 },
    France: { lat: 46.2276, lng: 2.2137 },
    FR: { lat: 46.2276, lng: 2.2137 },
    Russia: { lat: 61.5240, lng: 105.3188 },
    RU: { lat: 61.5240, lng: 105.3188 },
    WIPO: { lat: 46.2044, lng: 6.1432 },
    WO: { lat: 46.2044, lng: 6.1432 },
  };

  // Build markers array for GoogleMap
  const markers = Object.entries(groupedByJurisdiction)
    .map(([jurisdiction, items]) => {
      const coords = jurisdictionCoordinates[jurisdiction];
      if (!coords) return null;
      return {
        jurisdiction,
        lat: coords.lat,
        lng: coords.lng,
        count: items.length,
        info: `<div style="font-family: Arial, sans-serif;"><strong>${jurisdiction}</strong><div>${items.length} ${searchType}(s)</div></div>`,
      };
    })
    .filter(Boolean);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Geographic Distribution
        </h3>
        <div className="text-sm text-gray-300">
          {Object.keys(groupedByJurisdiction).length} jurisdictions
        </div>
      </div>

      <div className="relative h-[600px] rounded-xl overflow-hidden">
        {/* Google Map fills the container */}
        <div className="absolute inset-0">
          {markers.length ? (
            <GoogleMap markers={markers} zoom={2} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-950/80 via-purple-900/60 to-slate-900/80 flex items-center justify-center text-gray-400">
              No geographic data available
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white">
          <h4 className="text-sm font-semibold mb-2">Legend</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Active marker</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>Selected marker</span>
            </div>
            <div className="text-gray-300 mt-2">
              Click markers to view details
            </div>
          </div>
        </div>

        {/* Stats panel */}
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white">
          <h4 className="text-sm font-semibold mb-2">Statistics</h4>
          <div className="space-y-1 text-xs">
            <div>
              Total Results: <span className="font-bold">{results.length}</span>
            </div>
            <div>
              Jurisdictions:{" "}
              <span className="font-bold">
                {Object.keys(groupedByJurisdiction).length}
              </span>
            </div>
            <div>
              Type: <span className="font-bold capitalize">{searchType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
