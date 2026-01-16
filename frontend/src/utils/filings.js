export const FILINGS_KEY = 'my_filings';

const loadRaw = () => {
  try {
    const raw = localStorage.getItem(FILINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse filings', e);
    return [];
  }
};

export function loadFilings() {
  return loadRaw();
}

export function saveFilings(list) {
  try {
    localStorage.setItem(FILINGS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save filings', e);
  }
}

export function generateId() {
  return 'FT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function generateApplicationNumber() {
  return 'APP-' + Date.now().toString().slice(-6);
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function computeStatus(filing) {
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

export function createFilingFromForm(form) {
  const now = new Date();
  const filingDate = now.toISOString().slice(0,10);
  // default expiry 20 years from filing
  const expiry = addYears(now, 20).toISOString().slice(0,10);

  const filing = {
    id: generateId(),
    applicationNumber: generateApplicationNumber(),
    title: form.title || 'Untitled Invention',
    jurisdiction: form.jurisdiction || 'IN',
    filingDate,
    expiryDate: expiry,
    grantDate: form.grantDate || null,
    trackedAt: new Date().toISOString(),
    raw: form,
  };
  return filing;
}

export function addFiling(form) {
  const list = loadRaw();
  const filing = createFilingFromForm(form);
  list.unshift(filing);
  saveFilings(list);
  return filing;
}
