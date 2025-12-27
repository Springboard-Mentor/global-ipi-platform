import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IPSearch = () => {
  const navigate = useNavigate();

  // ✅ Required States
  const [searchType, setSearchType] = useState("PATENT"); // PATENT | TRADEMARK
  const [source, setSource] = useState("EXTERNAL"); // LOCAL | EXTERNAL
  const [keyword, setKeyword] = useState("");

  // ✅ SEARCH HANDLER (FIXED)
  const handleSearch = (e) => {
    e.preventDefault();

    console.log("SEARCH CLICKED", {
    keyword,
    searchType,
    source,
  });


    if (!keyword.trim()) {
      alert("Please enter a keyword");
      return;
    }

    navigate(
      `/search-results?keyword=${encodeURIComponent(
        keyword
      )}&type=${searchType}&source=${source}`
    );
  };

  // ✅ RESET
  const handleReset = () => {
    setKeyword("");
    setSearchType("PATENT");
    setSource("EXTERNAL");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white hover:text-blue-300"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-white">IP Search</h1>
          <div />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Search Intellectual Property
          </h2>

          {/* 🔹 PATENT / TRADEMARK TOGGLE */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/5 rounded-xl p-1 inline-flex">
              {["PATENT", "TRADEMARK"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSearchType(t)}
                  className={`px-6 py-2 rounded-lg ${
                    searchType === t
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 🔹 LOCAL / GOOGLE PATENTS TOGGLE */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/5 rounded-xl p-1 inline-flex">
              {[
                { label: "Local Database", value: "LOCAL" },
                { label: "Google Patents", value: "EXTERNAL" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSource(s.value)}
                  className={`px-6 py-2 rounded-lg ${
                    source === s.value
                      ? s.value === "LOCAL"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "text-gray-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 🔹 SEARCH FORM */}
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="text-white block mb-2">
                Keyword <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full p-3 bg-white/10 text-white border border-white/30 rounded-xl"
                placeholder="Enter keyword"
                required
              />
            </div>

            {/* 🔹 BUTTONS */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                Search
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IPSearch;
