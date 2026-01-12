import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";

const PatentFiling = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "" });

  // 1. Define the Fields (Now including 'Patent Type')
  const formFields = [
    {
      id: "patentType",
      label: "Type of Patent Application",
      type: "select",
      options: ["Utility Patent", "Design Patent", "Plant Patent", "Provisional Application"],
      grid: "col-span-2", // Full width
    },
    {
      id: "title",
      label: "Invention Title",
      type: "text",
      placeholder: "e.g., Solar Powered Water Purifier",
      grid: "col-span-2",
    },
    {
      id: "inventor",
      label: "Primary Inventor",
      type: "text",
      placeholder: "Full Legal Name",
      grid: "col-span-1", // Half width
    },
    {
      id: "filingDate",
      label: "Filing Date",
      type: "date",
      placeholder: "",
      grid: "col-span-1", 
    },
    {
      id: "abstract",
      label: "Abstract / Description",
      type: "textarea",
      placeholder: "Brief summary of the invention and its primary use...",
      grid: "col-span-2",
    },
    {
      id: "diagram",
      label: "Technical Diagrams (PDF/PNG)",
      type: "file",
      placeholder: "",
      grid: "col-span-2",
    },
  ];

  // 2. Initialize State
  const [formData, setFormData] = useState(
    formFields.reduce((acc, field) => ({ ...acc, [field.id]: field.type === 'select' ? field.options[0] : "" }), {})
  );

  const handleChange = (e) => {
    const value = e.target.type === 'file' ? e.target.files[0] : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate filing for now
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setPopup({ message: "Application Submitted Successfully!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Animation (Same as Login) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        
        {/* Header Section */}
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">File a New Patent</h2>
            <p className="text-gray-300">Select your patent category and enter details below.</p>
        </div>

        {/* The Form Card */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.id} className={field.grid}>
                <label className="text-blue-200 text-sm font-semibold mb-2 block tracking-wide">
                  {field.label}
                </label>
                
                {/* RENDER LOGIC BASED ON TYPE */}
                {field.type === "select" ? (
                   <div className="relative">
                     <select
                       name={field.id}
                       value={formData[field.id]}
                       onChange={handleChange}
                       className="w-full p-3 bg-slate-800/50 text-white border border-blue-400/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:bg-slate-800/70 transition"
                     >
                       {field.options.map(opt => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                     </select>
                     {/* Custom Arrow Icon */}
                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                       <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                     </div>
                   </div>

                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.id}
                    rows="4"
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 resize-none transition-all"
                  />
                ) : field.type === "file" ? (
                   <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition cursor-pointer group">
                      <input
                        type="file"
                        name={field.id}
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, PNG, JPG</p>
                   </div>
                ) : (
                  <input
                    type={field.type}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id]}
                    onChange={handleChange}
                    className="w-full p-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition-all [color-scheme:dark]" 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-white/10">
             <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2.5 text-gray-300 hover:text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? "Processing..." : "Submit Application"}
            </button>
          </div>

        </form>
      </div>

      <Popup
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: "", type: "" })}
      />
    </div>
  );
};

export default PatentFiling;