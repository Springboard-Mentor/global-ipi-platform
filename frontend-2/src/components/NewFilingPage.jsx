import React, { useState } from "react";
import axios from "axios";
import { PenTool } from "lucide-react"; // Importing an icon for the new field for better visual

const NewFilingPage = ({ user }) => {
  // ✅ UPDATED: State now includes patentNumber
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    filingType: "",
    inventorName: "",
    email: "", 
    assignee: user?.name || "", 
    filingDate: "",
    expirationDate: "", 
    jurisdiction: "",
    applicationNumber: "", 
    // --- NEW FIELD ADDED ---
    patentNumber: "",         // New Field for the official patent number
    // -----------------------
    patentStatus: "Pending", 
    description: "",
    tags: "",
  });

  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({});

    // Debugging: Check console to see exactly what is being sent
    console.log("Sending Data:", formData);

    try {
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
        email: "",
        assignee: user?.name || "",
        filingDate: "",
        expirationDate: "",
        jurisdiction: "",
        applicationNumber: "",
        patentNumber: "", // Reset patentNumber
        patentStatus: "Pending",
        description: "",
        tags: "",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Filing submission failed. Check console.",
      });
      console.error("Submission Error:", err.response?.data);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-xl p-10 rounded-2xl border border-gray-100">
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
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">Patent Title</label>
            <input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter the official title of the invention"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          
          {/* PATENT NUMBER (NEW FIELD) */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                Official Patent Number <PenTool size={12} className="text-gray-400"/> 
                <span className="text-xs font-normal text-gray-400 ml-2">(Enter if already granted)</span>
            </label>
            <input
              type="text"
              id="patentNumber"
              value={formData.patentNumber}
              onChange={handleChange}
              placeholder="e.g. US11223344B2 (Optional)"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          {/* End NEW FIELD */}

          {/* CATEGORY (Updated with more options) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select Category</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Biotech">Biotech</option>
              <option value="Software">Software</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Chemical">Chemical / Pharma</option>
              <option value="Design">Industrial Design</option>
            </select>
          </div>

          {/* FILING TYPE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Type of Filing</label>
            <select
              id="filingType"
              value={formData.filingType}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select Type</option>
              <option value="Provisional">Provisional Application</option>
              <option value="Complete">Non-Provisional (Complete)</option>
              <option value="PCT">PCT International</option>
            </select>
          </div>

          {/* INVENTOR NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Inventor Name</label>
            <input
              id="inventorName"
              value={formData.inventorName}
              onChange={handleChange}
              placeholder="Primary Inventor"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* EMAIL (New Field) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Contact Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="inventor@example.com"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

           {/* ASSIGNEE (New Field) */}
           <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Assignee (Owner)</label>
            <input
              type="text"
              id="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Company or Individual Name"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* JURISDICTION (Updated options) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Jurisdiction</label>
            <select
              id="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            >
              <option value="">Select Region</option>
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="EU">Europe (EU)</option>
              <option value="CN">China (CN)</option>
              <option value="JP">Japan (JP)</option>
              <option value="WO">World (PCT)</option>
            </select>
          </div>

          {/* FILING DATE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Filing Date</label>
            <input
              type="date"
              id="filingDate"
              value={formData.filingDate}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* EXPIRATION DATE (New Field) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Est. Expiration Date</label>
            <input
              type="date"
              id="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

           {/* APPLICATION NUMBER (New Related Field) */}
           <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Application No.</label>
            <input
              type="text"
              id="applicationNumber"
              value={formData.applicationNumber}
              onChange={handleChange}
              placeholder="e.g. 202411001234"
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

           {/* STATUS (New Related Field) */}
           <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600">Current Status</label>
            <select
              id="patentStatus"
              value={formData.patentStatus}
              onChange={handleChange}
              className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="Under Examination">Under Examination</option>
              <option value="Granted">Granted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1 mt-4">
          <label className="text-sm font-semibold text-gray-600">Abstract / Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the invention in detail..."
            className="input-box h-28 border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
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
            className="input-box border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
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