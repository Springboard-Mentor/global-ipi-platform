import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [sortBy, setSortBy] = useState("relevance");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - in real app, this would come from API
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    // Simulate API call with search parameters
    const mockResults = generateMockResults(
      searchParams.get("type") || "patent"
    );
    setResults(mockResults);
    setTotalResults(mockResults.length);
  }, [searchParams]);

  const generateMockResults = (type) => {
    const keyword = searchParams.get("keyword") || "";
    const assigneeFilter = searchParams.get("assignee") || "";
    const inventorFilter = searchParams.get("inventor") || "";
    const jurisdictionFilter = searchParams.get("jurisdiction") || "";

    const mockData = [];

    // Generate keyword-relevant titles
    const getRelevantTitle = (type, keyword, index) => {
      if (!keyword) {
        return type === "patent"
          ? `Method and System for ${
              [
                "AI Processing",
                "Data Analysis",
                "Machine Learning",
                "Cloud Computing",
              ][index % 4]
            }`
          : `Brand Name ${index} - ${
              ["Technology", "Fashion", "Food", "Services"][index % 4]
            }`;
      }

      const keywordLower = keyword.toLowerCase();
      if (type === "patent") {
        return `${keyword} Processing System and Method for Advanced ${
          ["Technology", "Innovation", "Solutions", "Applications"][index % 4]
        }`;
      } else {
        return `${keyword} Brand - ${
          ["Premium", "Professional", "Advanced", "Elite"][index % 4]
        } ${["Services", "Products", "Solutions", "Systems"][index % 4]}`;
      }
    };

    // Generate relevant abstract
    const getRelevantAbstract = (keyword) => {
      if (!keyword) {
        return "A comprehensive system and method for implementing advanced technological solutions...";
      }
      return `A comprehensive system and method for implementing ${keyword}-based solutions, providing advanced capabilities for ${keyword} processing and analysis...`;
    };

    for (let i = 1; i <= 47; i++) {
      const title = getRelevantTitle(type, keyword, i);
      const assignee =
        assigneeFilter ||
        ["Tech Corp", "Innovation Labs", "Global Industries", "Future Systems"][
          i % 4
        ];
      const inventor =
        type === "patent"
          ? inventorFilter ||
            ["John Smith", "Jane Doe", "Bob Johnson", "Alice Williams"][i % 4]
          : null;
      const jurisdiction =
        jurisdictionFilter ||
        ["United States", "European Union", "China", "Japan"][i % 4];

      mockData.push({
        id: i,
        type: type,
        title: title,
        number: type === "patent" ? `US${10000000 + i}` : `TM${5000000 + i}`,
        assignee: assignee,
        inventor: inventor,
        jurisdiction: jurisdiction,
        status: ["Granted", "Pending", "Active", "Expired"][i % 4],
        date: new Date(2024 - (i % 5), i % 12, (i % 28) + 1)
          .toISOString()
          .split("T")[0],
        abstract: getRelevantAbstract(keyword),
      });
    }
    return mockData;
  };

  // Apply filters and sorting
  const getFilteredResults = () => {
    let filtered = [...results];

    // Apply keyword filter if searching within results
    const keyword = searchParams.get("keyword");
    if (keyword) {
      const keywordLower = keyword.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(keywordLower) ||
          r.assignee.toLowerCase().includes(keywordLower) ||
          (r.inventor && r.inventor.toLowerCase().includes(keywordLower)) ||
          r.abstract.toLowerCase().includes(keywordLower) ||
          r.number.toLowerCase().includes(keywordLower)
      );
    }

    // Apply assignee filter
    const assigneeFilter = searchParams.get("assignee");
    if (assigneeFilter) {
      filtered = filtered.filter((r) =>
        r.assignee.toLowerCase().includes(assigneeFilter.toLowerCase())
      );
    }

    // Apply inventor filter
    const inventorFilter = searchParams.get("inventor");
    if (inventorFilter && searchParams.get("type") === "patent") {
      filtered = filtered.filter(
        (r) =>
          r.inventor &&
          r.inventor.toLowerCase().includes(inventorFilter.toLowerCase())
      );
    }

    // Apply jurisdiction filter
    const jurisdictionFilter = searchParams.get("jurisdiction");
    if (jurisdictionFilter) {
      filtered = filtered.filter((r) => r.jurisdiction === jurisdictionFilter);
    }

    // Apply status filter from sidebar
    if (filterStatus) {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Sort
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

  const filteredResults = getFilteredResults();
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
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
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "map"
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
                            className={`px-2 py-1 rounded text-xs ${
                              result.status === "Granted" ||
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
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
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

  // Map coordinates for different jurisdictions
  const jurisdictionCoordinates = {
    "United States": { top: "45%", left: "20%" },
    "European Union": { top: "35%", left: "48%" },
    China: { top: "42%", left: "70%" },
    Japan: { top: "38%", left: "78%" },
    "South Korea": { top: "40%", left: "76%" },
    India: { top: "50%", left: "65%" },
    Canada: { top: "30%", left: "22%" },
    Australia: { top: "75%", left: "75%" },
    "United Kingdom": { top: "32%", left: "46%" },
    Germany: { top: "33%", left: "50%" },
  };

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

      <div className="relative h-[600px] bg-gradient-to-br from-indigo-950/80 via-purple-900/60 to-slate-900/80 rounded-xl overflow-hidden">
        {/* World map background representation */}
        <div className="absolute inset-0">
          {/* Continents as blurred shapes */}
          <div className="absolute w-[30%] h-[50%] bg-white/5 rounded-full blur-3xl top-[25%] left-[15%]" />
          <div className="absolute w-[25%] h-[40%] bg-white/5 rounded-full blur-3xl top-[20%] left-[42%]" />
          <div className="absolute w-[35%] h-[45%] bg-white/5 rounded-full blur-3xl top-[30%] left-[60%]" />
          <div className="absolute w-[20%] h-[30%] bg-white/5 rounded-full blur-3xl top-[60%] left-[70%]" />
        </div>

        {/* Markers for each jurisdiction */}
        {Object.entries(groupedByJurisdiction).map(([jurisdiction, items]) => {
          const coords = jurisdictionCoordinates[jurisdiction] || {
            top: "50%",
            left: "50%",
          };
          const isSelected = selectedMarker === jurisdiction;

          return (
            <div
              key={jurisdiction}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ top: coords.top, left: coords.left }}
            >
              {/* Marker */}
              <button
                onClick={() =>
                  setSelectedMarker(isSelected ? null : jurisdiction)
                }
                className="relative group"
              >
                {/* Pulse animation */}
                <span className="absolute inset-0 w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-30"></span>

                {/* Main marker */}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-yellow-500 scale-125"
                      : "bg-blue-500 hover:bg-blue-400"
                  } shadow-lg`}
                >
                  <span className="text-white text-xs font-bold">
                    {items.length}
                  </span>
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                    {jurisdiction}
                    <div className="text-gray-300">
                      {items.length} {searchType}(s)
                    </div>
                  </div>
                </div>
              </button>

              {/* Detailed popup when selected */}
              {isSelected && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/20 w-80 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900">
                        {jurisdiction}
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedMarker(null);
                          setExpandedMarker(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      {items.length} {searchType}
                      {items.length !== 1 ? "s" : ""} found
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(expandedMarker === jurisdiction
                        ? items
                        : items.slice(0, 5)
                      ).map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {item.number}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded ${
                                item.status === "Granted" ||
                                item.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : item.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {item.assignee} • {item.date}
                          </div>
                        </div>
                      ))}
                      {items.length > 5 && expandedMarker !== jurisdiction && (
                        <button
                          onClick={() => setExpandedMarker(jurisdiction)}
                          className="w-full text-center text-xs text-blue-600 hover:text-blue-800 py-2 hover:bg-blue-50 rounded transition-colors"
                        >
                          +{items.length - 5} more results (click to show all)
                        </button>
                      )}
                      {expandedMarker === jurisdiction && items.length > 5 && (
                        <button
                          onClick={() => setExpandedMarker(null)}
                          className="w-full text-center text-xs text-gray-600 hover:text-gray-800 py-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

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
