import React, { useState, useEffect, useRef } from 'react';
import { FileText, User, MapPin, UploadCloud, CheckCircle, AlertCircle, File, X, Plus } from 'lucide-react';

const NewFilingPage = () => {
    // 1. STATE INITIALIZATION (Draft Persistence)
    // Initialize form data from localStorage on load
    const [formData, setFormData] = useState(() => {
        try {
            const savedDraft = localStorage.getItem('filingDraft');
            return savedDraft ? JSON.parse(savedDraft) : {
                title: '',
                abstract: '',
                inventorName: '', // Example inventor field
                jurisdiction: '',
            };
        } catch (e) {
            console.error("Error loading draft from localStorage:", e);
            return { title: '', abstract: '', inventorName: '', jurisdiction: '' };
        }
    });

    const [files, setFiles] = useState([]); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); 
    
    const fileInputRef = useRef(null); 

    // 2. EFFECT: AUTOMATICALLY SAVE DRAFT
    // Saves formData to localStorage whenever the state changes
    useEffect(() => {
        localStorage.setItem('filingDraft', JSON.stringify(formData));
    }, [formData]);

    // 3. HANDLERS
    
    // Handler for all controlled input fields (Title, Abstract, Selects)
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).filter(
            // Basic validation check (max 10MB per file)
            file => file.size <= 10 * 1024 * 1024
        );
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    };
    
    const handleRemoveFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        
        // --- SIMULATE API CALL ---
        console.log("Submitting form data and files:", formData, files);

        setTimeout(() => {
            setIsSubmitting(false);
            
            // ✅ Clear Draft and Files upon successful simulation
            localStorage.removeItem('filingDraft');
            setFormData({ title: '', abstract: '', inventorName: '', jurisdiction: '' });
            setFiles([]);
            
            setSubmitStatus('success'); 
            setTimeout(() => setSubmitStatus(null), 3000); 
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900">New Patent Filing</h2>
                <p className="text-slate-600 mt-1">Submit the required details to begin your intellectual property protection process.</p>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    Filing request successfully simulated and draft cleared!
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    Error simulating filing.
                </div>
            )}

            {/* Filing Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-8">

                {/* Section 1: Invention Details */}
                <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3 border-b pb-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Invention Details
                    </h3>

                    {/* Title (CONTROLLED INPUT) */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Title of Invention *</label>
                        <input
                            type="text"
                            id="title"
                            placeholder="e.g., AI-Driven Data Optimization System"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            value={formData.title} 
                            onChange={handleChange} 
                        />
                    </div>

                    {/* Abstract/Description (CONTROLLED TEXTAREA) */}
                    <div>
                        <label htmlFor="abstract" className="block text-sm font-medium text-slate-700 mb-1">Abstract / Brief Description *</label>
                        <textarea
                            id="abstract"
                            rows="4"
                            placeholder="Provide a brief summary of the invention, its purpose, and its novelty."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            value={formData.abstract} 
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Section 2: Inventors & Jurisdiction */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3 border-b pb-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Inventors
                        </h3>
                        {/* Inventor Name (CONTROLLED INPUT) */}
                        <div>
                            <label htmlFor="inventorName" className="block text-sm font-medium text-slate-700 mb-1">Inventor Full Name *</label>
                            <input
                                type="text"
                                id="inventorName"
                                placeholder="Inventor 1 Name"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                                required
                                value={formData.inventorName} 
                                onChange={handleChange}
                            />
                        </div>
                        <button type="button" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            <Plus className="w-4 h-4 inline-block align-text-bottom mr-1" /> Add Another Inventor
                        </button>
                    </div>

                    <div className="space-y-5">
                        <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3 border-b pb-2">
                            <MapPin className="w-5 h-5 text-indigo-600" />
                            Jurisdiction
                        </h3>
                        {/* Primary Filing Country (CONTROLLED SELECT) */}
                        <div>
                            <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-700 mb-1">Primary Filing Country *</label>
                            <select
                                id="jurisdiction"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                value={formData.jurisdiction} 
                                onChange={handleChange}
                            >
                                <option value="">Select Country</option>
                                <option value="US">United States (USPTO)</option>
                                <option value="EP">Europe (EPO)</option>
                                <option value="CN">China (CNIPA)</option>
                                <option value="JP">Japan (JPO)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 3: File Upload */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-3 border-b pb-2">
                        <UploadCloud className="w-5 h-5 text-indigo-600" />
                        Supporting Documents ({files.length} selected)
                    </h3>
                    
                    {/* Hidden File Input (Ref is attached here) */}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        multiple 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf, .doc, .docx, .zip"
                    />

                    {/* Drag & Drop Area (Clickable) */}
                    <div 
                        onClick={handleFileUploadClick}
                        className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center cursor-pointer hover:border-indigo-500 transition"
                    >
                        <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-slate-700">Drag and drop files here, or click to browse</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or ZIP up to 10MB per file</p>
                    </div>
                    
                    {/* Selected Files List */}
                    {files.length > 0 && (
                        <div className="space-y-3 pt-2">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <File className="h-5 w-5 text-indigo-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{file.name}</p>
                                            <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveFile(index)}
                                        className="p-1 text-slate-400 hover:text-red-500 transition"
                                        title="Remove file"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Sending Filing...
                            </span>
                        ) : 'Submit New Filing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewFilingPage;