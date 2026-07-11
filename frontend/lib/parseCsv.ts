import Papa from 'papaparse';

export function parseCSVFile(file: File): Promise<{ headers: string[], rows: any[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          // If there are errors, and it's not just a minor warning, we might reject.
          // For simplicity, we'll just log warnings or reject on first major error.
          console.warn("CSV Parsing warnings:", results.errors);
        }

        if (!results.data || results.data.length === 0) {
          reject(new Error("The CSV file is empty."));
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data;

        resolve({ headers, rows });
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}
