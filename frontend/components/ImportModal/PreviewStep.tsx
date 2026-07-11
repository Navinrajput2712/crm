import React from 'react';
import { FileText, X } from 'lucide-react';

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface PreviewStepProps {
  headers: string[];
  rows: any[];
  fileName: string;
  fileSize: number;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PreviewStep({ headers, rows, fileName, fileSize, error, onCancel, onConfirm }: PreviewStepProps) {
  const totalRows = rows.length;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-8 py-6 flex-1 space-y-6">
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Import failed</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* File Badge */}
        <div className="bg-[#F8FAFC] rounded-xl border border-gray-100 p-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{fileName}</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">{formatFileSize(fileSize)}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Table */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#F8FAFC] border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  {headers.map((header: string, i: number) => (
                    <th key={i} className="px-6 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {rows.slice(0, 4).map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {headers.map((header: string, j: number) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {Array.isArray(row) ? row[j] : (row[header] || '-')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 italic mt-4">
          Showing first {Math.min(totalRows, 4)} of {totalRows} rows detected in the file.
        </p>

      </div>
      
      {/* Footer */}
      <div className="px-8 py-5 border-t border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
        <button 
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <div className="flex items-center gap-3">
           <button 
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
