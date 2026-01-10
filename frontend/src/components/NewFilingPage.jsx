import React, { useState } from "react";
import axios from "axios";

const NewFilingPage = ({ user }) => {
  // --- STATE MANAGEMENT ---
  
  // 1. Form Data State: Holds the values for all input fields
  // keys match the backend 'UserFiling.java' entity exactly
  const [formData, setFormData] = useState({
    title: "",            
    category: "",         
    filingType: "",       
    inventorName: "",     
    filingDate: "",       
    assignee: user?.name || "", // Defaults to logged-in user's name
    jurisdiction: "",     
    description: "",      
    tags: "",             
  });

  // 2. Alert State: Handles success or error messages shown to the user
  const [alert, setAlert] = useState({ type: "", message: "" });

  // --- HANDLERS ---

  // Updates specific fields in formData when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    setAlert({});       // Clear any previous alerts

    try {
      // ✅ STEP 1: Send data to the Backend
      // NOTE: Ensure port is correct! (If Java runs on 8080, change 5001 to 8080)
      const res = await axios.post(
        "http://localhost:5001/api/filings", 
        formData
      );

      // ✅ STEP 2: Clear Search Cache
      // This ensures that when you go back to the "Search" page, 
      // it re-fetches data from the database to show this new filing.
      sessionStorage.removeItem('searchPageParams');

      // ✅ STEP 3: Show Success Message
      setAlert({ type: "success", message: "Patent Filing Submitted Successfully!" });

      // ✅ STEP 4: Reset the Form
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
      // Handle Errors
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Filing submission failed. Check console for details.",
      });
      console.error("Submission Error:", err.response?.data);
    }
  };

  // --- RENDER COMPONENT ---
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-xl p-10 rounded-2xl border border-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        New Patent Filing
      </h1>

      {/* Alert Box: Shows only if there is a message */}
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
          
          {/* TITLE INPUT */}
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

          {/* CATEGORY DROPDOWN */}
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

          {/* FILING TYPE DROPDOWN */}
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

          {/* INVENTOR NAME INPUT */}
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

          {/* FILING DATE PICKER */}
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

          {/* JURISDICTION DROPDOWN */}
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

        {/* DESCRIPTION TEXTAREA */}
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

        {/* TAGS INPUT */}
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

        {/* SUBMIT BUTTON */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-lg font-semibold transition shadow-md">
          Submit Patent Filing
        </button>
      </form>
    </div>
  );
};

export default NewFilingPage;