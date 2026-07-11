import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Info, Download, CloudUpload } from 'lucide-react';

export function UploadStep({ onFileAccepted, error, onCancel }: { onFileAccepted: (file: File) => void, error?: string, onCancel: () => void }) {
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-8 py-6 flex-1 space-y-6">
        
        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="w-12 h-12 bg-[#EEF2FF] rounded-full flex items-center justify-center mb-4">
            <Upload className="w-5 h-5 text-blue-600" strokeWidth={2.5} />
          </div>
          
          <p className="text-[15px] font-bold text-gray-900 mb-1">
            Drop your CSV file here
          </p>
          <p className="text-sm text-gray-500">
            or <span className="text-blue-600 font-semibold hover:underline">click to browse files</span>
          </p>
        </div>

        {error && (
          <div className="text-sm text-red-600 font-medium text-center">{error}</div>
        )}

        {/* Supported File Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EEF2FF] border border-blue-100">
            <Info className="w-4 h-4 text-blue-600 mr-2" strokeWidth={2.5} />
            <span className="text-[11px] font-bold text-blue-600 tracking-wide">Supported file: .csv (max 5MB)</span>
          </div>
        </div>

        {/* Required Headers Box */}
        <div className="border border-gray-200 rounded-xl p-5">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
            Required Column Headers
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {['Name', 'Email', 'Phone', 'Company'].map(header => (
              <span key={header} className="px-3 py-1 rounded border border-gray-200 text-xs text-gray-600 font-mono bg-white shadow-sm">
                {header}
              </span>
            ))}
          </div>
          
          <button className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Download Sample CSV Template
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
        <button 
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button 
          disabled
          className="px-5 py-2.5 rounded-lg bg-[#DBEAFE] text-blue-600 text-sm font-semibold flex items-center transition-colors cursor-not-allowed opacity-80"
        >
          <CloudUpload className="w-4 h-4 mr-2" />
          Upload File
        </button>
      </div>
    </div>
  );
}
