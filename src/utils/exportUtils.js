/**
 * Converts JSON data to CSV format compatible with Google Sheets
 * @param {Array} data - Array of objects to convert
 * @param {string} filename - Name of the file to download
 */
export function exportToCSV(data, filename = 'export') {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get all unique headers from the data
  const headers = Array.from(
    new Set(
      data.flatMap(obj => Object.keys(obj))
    )
  );

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];

        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }

        // Handle objects and arrays
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }

        // Handle strings with commas, quotes, or newlines
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    // Create a URL for the blob and trigger download
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Formats user info data for export
 * @param {Object} response - API response from user_info_xqwad
 * @returns {Array} Formatted array of objects ready for CSV export
 */
export function formatUserInfoForExport(response) {
  // Handle different response structures
  if (!response) {
    return [];
  }

  // If response is already an array, use it directly
  if (Array.isArray(response)) {
    return response;
  }

  // If response has a data property that's an array
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  // If response is a single object, wrap it in an array
  if (typeof response === 'object') {
    return [response];
  }

  return [];
}
