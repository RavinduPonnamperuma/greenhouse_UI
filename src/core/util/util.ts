
import * as XLSX from "xlsx";


export function exportToCSV(data: any[], fileName: string): void {
  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Data is empty or not an array');
    return;
  }

  // Transform data to array of arrays
  const headers = Object.keys(data[0]); // Get headers from the first object
  const arrayOfArrays = [
    headers, // Header row
    ...data.map(item => headers.map(header => item[header] ?? '')) // Map each object to an array of values
  ];

  // Create worksheet and export to CSV
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arrayOfArrays);
  const csvData: string = XLSX.utils.sheet_to_csv(worksheet);
  const blob: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const currentDate = new Date().toISOString().split('T')[0];
  link.download = `${fileName}_${currentDate}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
