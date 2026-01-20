import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getIPDetails } from "../../../api/ipApi";

const IPDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state with location state data if available
  const initialState = location.state?.ip ? {
    ...location.state.ip,
    // Ensure all fields are mapped correctly from location state
    assignee: location.state.ip.ownerName || location.state.ip.assignee,
    number: location.state.ip.applicationNumber || location.state.ip.number,
    inventor: location.state.ip.inventorName || location.state.ip.inventor,
    abstract: location.state.ip.abstractText || location.state.ip.abstract,
    jurisdiction: location.state.ip.country || location.state.ip.jurisdiction,
    status: location.state.ip.legalStatus || location.state.ip.status,
  } : null;

  const [ip, setIp] = useState(initialState);
  const [loading, setLoading] = useState(!initialState);
  const [error, setError] = useState(null);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString || dateString === "—" || dateString === "null" || dateString === "undefined") return "—";
    try {
      // Handle both ISO date strings (YYYY-MM-DD) and other date formats
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // text file
  const exportAsTextFile = () => {
    if (!ip) return;

    const content = `
IP DETAILS
=========================

Title: ${ip.title || "N/A"}
Status: ${ip.legalStatus || ip.status || "N/A"}
Asset Type: ${ip.assetType || "N/A"}

Owner: ${ip.assignee || ip.ownerName || "N/A"}
Issuing Authority: ${ip.jurisdiction || ip.country || "N/A"}
Area of Coverage: ${ip.coverage || "N/A"}

Application Number: ${ip.number || ip.applicationNumber || "N/A"}
Filed Date: ${formatDate(ip.filingDate)}
Publication Date: ${formatDate(ip.publicationDate)}
Priority Date: ${formatDate(ip.priorityDate)}
Grant Date: ${formatDate(ip.grantDate)}
Last Updated: ${formatDate(ip.updatedOn)}

IP Duration: ${ip.filingDate
        ? `20 Years (Expires in ${new Date(ip.filingDate).getFullYear() + 20})`
        : "N/A"
      }

Inventor(s): ${ip.inventor || ip.inventorName || "N/A"}
Reference Source: ${ip.referenceSource || "N/A"}

Abstract:
${ip.abstract || ip.abstractText || "N/A"}

Patent Link: ${ip.patentLink || "N/A"}
PDF Link: ${ip.pdfLink || "N/A"}

-------------------------
Generated from IP Portal
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${ip.number || "IP_Details"}.txt`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const pdfLink =
    ip?.pdfLink || (ip?.patentLink ? `${ip.patentLink}.pdf` : null);
  useEffect(() => {
    const fetchIPDetails = async () => {
      if (!ip) {
        try {
          setLoading(true);
          const data = await getIPDetails(id);
          console.log("Fetched IP Details:", data);
          // Map all fields including priorityDate, grantDate, and updatedOn
          setIp({
            ...data,
            assignee: data.ownerName || data.assignee,
            number: data.applicationNumber || data.number,
            inventor: data.inventorName || data.inventor,
            abstract: data.abstractText || data.abstract,
            // Map jurisdiction/country
            jurisdiction: data.country || data.jurisdiction,
            // Ensure date fields are preserved
            filingDate: data.filingDate,
            publicationDate: data.publicationDate,
            priorityDate: data.priorityDate,
            grantDate: data.grantDate,
            updatedOn: data.updatedOn,
            // Ensure status is mapped
            status: data.legalStatus || data.status,
          });
        } catch (err) {
          setError("Failed to load IP details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchIPDetails();
  }, [id, ip]);

  useEffect(() => {
    if (ip) console.log("IP DETAILS FROM API:", ip);
  }, [ip]);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading IP details...</div>
      </div>
    );
  }
  if (error || !ip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div>
          <p className="text-red-400 mb-4">{error || "IP details not found"}</p>
          <button
            onClick={() => navigate("/ip-search")}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  //  Derived Fields (API-Ready)
  const filingDate = formatDate(ip.filingDate);
  const publicationDate = formatDate(ip.publicationDate);
  const grantDate = formatDate(ip.grantDate);
  const priorityDate = formatDate(ip.priorityDate);
  const updatedOn = formatDate(ip.updatedOn);

  // Patent duration (20 years standard)
  const expiryYear =
    ip.filingDate ? new Date(ip.filingDate).getFullYear() + 20 : null;

  const duration =
    expiryYear ? `20 Years (Expires in ${expiryYear})` : "N/A";

  console.log("IP dates:", {
    filingDate: ip.filingDate,
    publicationDate: ip.publicationDate,
    grantDate: ip.grantDate,
    formattedFiling: formatDate(ip.filingDate),
    formattedPublication: formatDate(ip.publicationDate),
    duration
  });

  //  Legal Timeline (Event-based)
  const timeline = [
    {
      label: "Priority Date",
      date: formatDate(ip.priorityDate),
      description: "Initial priority filing",
      active: false,
    },
    {
      label: "Application Filed",
      date: formatDate(ip.filingDate),
      description: "Patent application officially filed",
      active: false,
    },
    {
      label: "Published",
      date: formatDate(ip.publicationDate),
      description: "Patent published for public access",
      active: false,
    },
    {
      label: "Patent Granted",
      date: formatDate(ip.grantDate),
      description: "Patent legally granted",
      active: Boolean(ip.grantDate),
    },
  ];

  //  Status Badge Styling
  const status = (ip.status || ip.legalStatus)?.toUpperCase() || "UNKNOWN";

  const statusColor =
    status === "GRANTED"
      ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]"
      : status === "PENDING"
        ? "bg-yellow-500"
        : status === "ACTIVE"
          ? "bg-green-500"
          : "bg-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-blue-300 transition"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white">IP Details</h1>
        <span />
      </div>

      {/* Top Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">{ip.title}</h2>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-xs rounded-full text-white ${statusColor}`}
          >
            {ip.status || ip.legalStatus || "UNKNOWN"}
          </span>
        </div>

        <div className="flex gap-3 mt-4 flex-wrap">
          {/* Subscribe */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600/80 hover:bg-blue-700 rounded-lg text-white transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 3h14a2 2 0 012 2v16l-9-5-9 5V5a2 2 0 012-2z" />
            </svg>
            Subscribe
          </button>

          {/* Track */}
          {localStorage.getItem('token') ? (
            <button
              onClick={async () => {
                try {
                  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';
                  const payload = {
                    title: ip.title,
                    abstractText: ip.abstract || ip.abstractText || null,
                    inventors: ip.inventor || ip.inventorName || null,
                    assignee: ip.assignee || ip.ownerName || null,
                    applicationNumber: ip.number || ip.applicationNumber || null,
                    jurisdiction: ip.jurisdiction || null,
                    ipType: ip.type || ip.kind || 'Patent',
                    filingDate: ip.filingDate ? new Date(ip.filingDate).toISOString().split('T')[0] : null,
                    priorityDate: ip.priorityDate ? new Date(ip.priorityDate).toISOString().split('T')[0] : null,
                    publicationDate: ip.publicationDate ? new Date(ip.publicationDate).toISOString().split('T')[0] : null,
                    grantDate: ip.grantDate ? new Date(ip.grantDate).toISOString().split('T')[0] : null,
                  };

                  const token = localStorage.getItem('token');

                  // Debug: ensure token is present and headers built correctly
                  console.debug('Track: token present?', !!token);

                  const headers = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;

                  // Send CORS request; do not use credentials: 'include' here for token-based auth
                  const resp = await fetch(`${BASE_URL}/api/filing-tracker/track`, {
                    method: 'POST',
                    mode: 'cors',
                    headers,
                    body: JSON.stringify(payload),
                  });

                  if (resp.status === 401) {
                    // Not authorized — force login
                    console.warn('Track request unauthorized (401). Redirecting to login.');
                    navigate('/login');
                    return;
                  }

                  if (resp.ok) {
                    const data = await resp.json();
                    if (data && data.id) navigate(`/filing-detail/${data.id}`);
                  } else {
                    const text = await resp.text();
                    console.error('Failed to track filing', text);
                    alert('Failed to track filing. Please try again.');
                  }
                } catch (err) {
                  console.error('Error tracking filing', err);
                  alert('Error tracking filing');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600/80 hover:bg-green-700 rounded-lg text-white transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Track
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-600/80 hover:bg-gray-700 rounded-lg text-white transition"
            >
              Log in to Track
            </button>
          )}

          {/* Export */}
          <button
            onClick={exportAsTextFile}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600/80 hover:bg-purple-700 rounded-lg text-white transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <path d="M7 10l5 5 5-5" />
              <path d="M12 15V3" />
            </svg>
            Export PDF
          </button>

          {/* Notify */}
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-600/80 hover:bg-slate-700 rounded-lg text-white transition">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5" />
              <path d="M9 17a3 3 0 006 0" />
            </svg>
            Notify
          </button>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm text-gray-300">
          <div>
            <span className="text-white">Owner:</span> {ip.assignee || "N/A"}
          </div>
          <div>
            <span className="text-white">Issuing Authority:</span>{" "}
            {ip.jurisdiction || "N/A"}
          </div>
          <div>
            <span className="text-white">Area of Coverage:</span>{" "}
            {ip.coverage || "United States"}
          </div>

          <div>
            <span className="text-white">Application Number:</span>{" "}
            {ip.number || "N/A"}
          </div>
          <div>
            <span className="text-white">Filed Date:</span> {filingDate}
          </div>
          <div>
            <span className="text-white">Publication Date:</span>{" "}
            {publicationDate}
          </div>
          <div>
            <span className="text-white">Priority Date:</span> {priorityDate}
          </div>
          <div>
            <span className="text-white">Grant Date:</span> {grantDate}
          </div>
          <div>
            <span className="text-white">IP Duration:</span> {duration}
          </div>
          <div>
            <span className="text-white">Last Updated:</span> {updatedOn}
          </div>
        </div>


        <p className="mt-4 text-gray-400 text-sm">
          <span className="text-white">Abstract:</span> {ip.abstract || ip.abstractText || "N/A"}
        </p>

        {ip.inventor && (
          <p className="mt-2 text-gray-400 text-sm">
            <span className="text-white">Inventor(s):</span>{" "}
            {ip.inventor || "N/A"}
          </p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-h-[600px] overflow-y-auto hide-scrollbar">
          <h3 className="text-white font-semibold mb-6">
            Legal Status Timeline
          </h3>

          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-white/20" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                  <div className="relative z-10">
                    <div
                      className={`w-6 h-6 rounded-full ${item.active
                        ? "w-6 h-6 bg-green-400 shadow-[0_0_14px_rgba(34,197,94,0.9)]"
                        : "w-4 h-4 bg-blue-400"
                        } rounded-full border-2 border-white/30`}
                    />
                  </div>

                  <div>
                    <p className="text-white text-sm font-medium">
                      {item.label}
                    </p>
                    <p className="text-gray-400 text-xs">{item.date}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[260px]">
            <p className="text-gray-300 text-sm mb-3">
              Document preview available
            </p>

            {/* PDF Button */}
            {ip.pdfLink && (
              <a
                href={ip.pdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                View Full Document (PDF)
              </a>
            )}

            {/* Google Patents Link */}
            {ip.patentLink && (
              <a
                href={ip.patentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-400 text-xs mt-3 hover:underline"
              >
                View on Google Patents →
              </a>
            )}

            <p className="text-gray-500 text-xs mt-3">PDF • Patent document</p>
          </div>

          {/* Citation Trend */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Citation Trend</h3>
            <div className="h-28 bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-blue-500/40 rounded-xl" />
            <p className="text-gray-400 text-xs mt-2">
              Citation growth over time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPDetails;
