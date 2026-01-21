const API_BASE_URL = 'http://localhost:8081/api/patent-filings';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Backend API functions
export async function createFiling(formData) {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('You must be logged in to submit a patent filing. Please log in and try again.');
    }

    // Calculate total fee (same logic as frontend)
    const base = 300;
    const patentTypeMultiplier = formData.patentType === 'Design' ? 0.8 : formData.patentType === 'Provisional' ? 0.5 : 1;
    const applicantMultiplier = formData.applicantType === 'Individual' ? 1 : formData.applicantType === 'Startup' ? 0.9 : formData.applicantType === 'Company' ? 1.2 : formData.applicantType === 'University' ? 0.8 : 1;
    const jurisdictionMultiplier = (formData.jurisdiction || '').toLowerCase().includes('us') ? 1.5 : (formData.jurisdiction || '').toLowerCase().includes('wipo') ? 1.8 : 1;
    const total = Math.round(base * patentTypeMultiplier * applicantMultiplier * jurisdictionMultiplier);

    // Map inventors array safely, filtering out empty names
    const inventors = Array.isArray(formData.inventors)
      ? formData.inventors
        .map(inv => {
          let nameVal = '';
          if (typeof inv === 'string') nameVal = inv;
          else if (inv && typeof inv === 'object' && inv.name) nameVal = inv.name;
          return { name: String(nameVal).trim() };
        })
        .filter(i => i.name.length > 0)
      : [];

    const requestBody = {
      applicantName: formData.applicantName || '',
      applicantType: formData.applicantType || 'Individual',
      nationality: formData.nationality || '',
      addressStreet: formData.addressStreet || '',
      addressCity: formData.addressCity || '',
      addressState: formData.addressState || '',
      addressPostalCode: formData.addressPostalCode || '',
      correspondenceSame: !!formData.correspondenceSame,
      correspondenceStreet: formData.correspondenceStreet || '',
      correspondenceCity: formData.correspondenceCity || '',
      correspondenceState: formData.correspondenceState || '',
      correspondencePostalCode: formData.correspondencePostalCode || '',
      email: formData.email || '',
      phone: formData.phone || '',
      filingRole: formData.filingRole || 'Inventor',
      isInventor: !!formData.isInventor,
      idType: formData.idType || '',
      idNumber: formData.idNumber || '',
      patentType: formData.patentType || 'Utility',
      jurisdiction: formData.jurisdiction || 'India',
      technicalField: formData.technicalField || '',
      title: formData.title || '',
      abstractText: formData.abstract || '',
      problemStatement: formData.problemStatement || '',
      novelty: formData.novelty || '',
      inventors: inventors,
      priorityClaim: !!formData.priorityClaim,
      priorityApplicationNumber: formData.priorityApplicationNumber || '',
      priorityDate: formData.priorityDate || '',
      specificationFilePath: formData.specificationFile && formData.specificationFile.name ? String(formData.specificationFile.name) : null,
      claimsFilePath: formData.claimsFile && formData.claimsFile.name ? String(formData.claimsFile.name) : null,
      drawingsFilePaths: formData.drawingsFiles ? formData.drawingsFiles.filter(f => f && f.name).map(f => String(f.name)) : [],
      paymentMethod: formData.paymentMethod || '',
      paymentStatus: formData.paymentStatus || 'unpaid',
      totalFee: total,
    };

    console.log('Sanitized Request Body:', JSON.stringify(requestBody, null, 2));

    const headers = getAuthHeaders();

    // Debug: Check if token exists
    if (!headers.Authorization) {
      console.error('No token found in localStorage. User must be logged in.');
      throw new Error('You must be logged in to submit a patent filing. Please log in and try again.');
    }

    console.log('Sending request to:', API_BASE_URL);
    console.log('Authorization header present:', !!headers.Authorization);

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid - clear it and ask user to login again
        localStorage.removeItem('token');
        throw new Error('Your session has expired. Please log in again to submit your filing.');
      }
      const error = await response.json().catch(() => ({ message: 'Failed to create filing' }));
      throw new Error(error.message || 'Failed to create filing');
    }

    const filing = await response.json();
    return mapBackendToFrontend(filing);
  } catch (error) {
    console.error('Error creating filing:', error);
    throw error;
  }
}

export async function updateFiling(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update filing' }));
      throw new Error(error.message || 'Failed to update filing');
    }

    const filing = await response.json();
    return mapBackendToFrontend(filing);
  } catch (error) {
    console.error('Error updating filing:', error);
    throw error;
  }
}

export async function loadFilings() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Not authenticated, return empty array
        return [];
      }
      throw new Error('Failed to load filings');
    }

    const filings = await response.json();
    return filings.map(mapBackendToFrontend);
  } catch (error) {
    console.error('Error loading filings:', error);
    return [];
  }
}

export async function getFilingById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to load filing');
    }

    const filing = await response.json();
    return mapBackendToFrontend(filing);
  } catch (error) {
    console.error('Error loading filing:', error);
    throw error;
  }
}

// Map backend response to frontend format
function mapBackendToFrontend(backendFiling) {
  return {
    ...backendFiling, // Include all backend fields
    trackedAt: backendFiling.createdAt, // key mapping for frontend compatibility
    // Ensure critical fields are accessible at top level if naming differs
    abstract: backendFiling.abstractText,
  };
}

export function computeStatus(filing) {
  // Use status from backend if available
  if (filing.status) {
    return filing.status;
  }

  // Fallback computation
  try {
    if (filing.grantDate) return 'GRANTED';
    const now = new Date();
    const expiry = filing.expiryDate ? new Date(filing.expiryDate) : null;
    if (expiry && now > expiry) return 'EXPIRED';
    if (expiry) {
      const sixMonths = new Date();
      sixMonths.setMonth(sixMonths.getMonth() + 6);
      if (expiry <= sixMonths) return 'EXPIRING SOON';
    }
    return 'FILED';
  } catch (e) {
    return 'FILED';
  }
}

// Legacy functions for backward compatibility
export const FILINGS_KEY = 'my_filings';

export function saveFilings(list) {
  // No-op, using backend now
}

export function generateId() {
  return 'FT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function generateApplicationNumber() {
  return 'APP-' + Date.now().toString().slice(-6);
}

export function addFiling(form) {
  // This is now async, but keeping for backward compatibility
  return createFiling(form);
}
