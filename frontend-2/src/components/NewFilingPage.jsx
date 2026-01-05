import React, { useState } from "react";
import axios from "axios";

const NewFilingPage = ({ user }) => {
  // ✅ UPDATED: Field names now match UserFiling.java exactly
  const [formData, setFormData] = useState({
    title: "",            // matches Backend 'title'
    category: "",         // matches Backend 'category'
    filingType: "",       // matches Backend 'filingType'
    inventorName: "",     // matches Backend 'inventorName'
    filingDate: "",       // matches Backend 'filingDate'
    assignee: user?.name || "", // matches Backend 'assignee'
    jurisdiction: "",     // matches Backend 'jurisdiction'
    description: "",      // matches Backend 'description'
    tags: "",             // matches Backend 'tags'
  });

  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({});

    try {
      // ✅ UPDATED: URL matches your Spring Boot Controller port (5001)
      const res = await axios.post(
        "http://localhost:5001/api/filings",
        formData
      );

      setAlert({ type: "success", message: "Patent Filing Submitted Successfully!" });

      // Reset form
      setFormData({
        title: "",
        category: "",
        filingType: "",
        inventorName: "",
        filingDate: "",
        assignee: user?.name || "",
        jurisdiction: "",
        description: "",
        tags: "",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Filing submission failed. Check console for details.",
      });
      console.error("Submission Error:", err.response?.data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl p-10 rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        New Patent Filing
      </h1>

      {alert.message && (
        <div
          className={`p-3 mb-4 text-center rounded-lg border ${
            alert.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* TITLE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Patent Title</label>
            <input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="input-box border p-2 rounded"
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="input-box border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Biotech">Biotech</option>
              <option value="Software">Software</option>
            </select>
          </div>

          {/* FILING TYPE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Type of Filing</label>
            <select
              id="filingType"
              value={formData.filingType}
              onChange={handleChange}
              className="input-box border p-2 rounded"
              required
            >
              <option value="">Select Type</option>
              <option value="Provisional">Provisional</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          {/* INVENTOR NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Inventor Name</label>
            <input
              id="inventorName"
              value={formData.inventorName}
              onChange={handleChange}
              placeholder="Inventor name"
              className="input-box border p-2 rounded"
              required
            />
          </div>

          {/* FILING DATE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Filing Date</label>
            <input
              type="date"
              id="filingDate"
              value={formData.filingDate}
              onChange={handleChange}
              className="input-box border p-2 rounded"
              required
            />
          </div>

          {/* JURISDICTION */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Jurisdiction</label>
            <select
              id="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              className="input-box border p-2 rounded"
              required
            >
              <option value="">Select Region</option>
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="EU">Europe (EU)</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Abstract / Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the invention..."
            className="input-box h-28 border p-2 rounded"
            required
          ></textarea>
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Tags</label>
          <input
            id="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="ai, machine learning, cloud"
            className="input-box border p-2 rounded"
          />
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition shadow-md">
          Submit Patent Filing
        </button>
      </form>
    </div>
  );
};

export default NewFilingPage;