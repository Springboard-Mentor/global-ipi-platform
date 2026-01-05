// frontend/src/utils/exportHelpers.js

/**
 * 📄 CSV EXPORT UTILITY
 * Converts raw database arrays into clean, spreadsheet-ready CSV files.
 */
export const exportToCSV = (data, fileName = 'IP_Report') => {
  if (!data || !data.length) {
    console.error('Export Failed: No data provided');
    return false;
  }

  try {
    // 1. Flatten data (Handles nested IPAsset objects)
    const flattenedData = data.map(item => {
      const obj = {};
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'object' && item[key] !== null) {
          obj[key] = JSON.stringify(item[key]).replace(/"/g, '""');
        } else {
          obj[key] = item[key];
        }
      });
      return obj;
    });

    // 2. Extract Headers
    const headers = Object.keys(flattenedData[0]);
    
    // 3. Build CSV Content
    const csvRows = [
      headers.join(','), // Header row
      ...flattenedData.map(row => 
        headers.map(fieldName => {
          const value = row[fieldName] ?? '';
          const escaped = ('' + value).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\r\n');

    // 4. Trigger Download
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (err) {
    console.error('CSV Generation Error:', err);
    return false;
  }
};

/**
 * 🖼️ CHART IMAGE EXPORT (Placeholder logic)
 * In production, use 'html2canvas' or 'canvg' to implement this.
 */
export const exportChartAsImage = (elementId, fileName = 'Chart_Export') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Chart element not found for export');
    return;
  }
  // This logic requires external libraries like html2canvas
  console.log(`Exporting element ${elementId} as ${fileName}.png...`);
};

/**
 * 📦 JSON DATA EXPORT
 */
export const exportToJSON = (data, fileName = 'Raw_Data_Dump') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  link.click();
};