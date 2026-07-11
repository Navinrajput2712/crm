import React, { useState } from 'react';
import { UploadStep } from './UploadStep';
import { PreviewStep } from './PreviewStep';
import { ProcessingStep } from './ProcessingStep';
import { ResultsStep } from './ResultsStep';
import { parseCSVFile } from '../../lib/parseCsv';
import { processLeads } from '../../lib/api';
import { CRMRecord } from '../../types/crm';
import { X, ChevronRight } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

interface ImportResults {
  totalRows: number;
  imported: number;
  skipped: number;
  importedRecords: CRMRecord[];
  skippedRecords: { row: any; reason: string }[];
}

export function ImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState<string>('');
  const [csvFileSize, setCsvFileSize] = useState<number>(0);
  const [error, setError] = useState<string | undefined>();
  const [results, setResults] = useState<ImportResults | null>(null);

  if (!isOpen) return null;

  const handleFileAccepted = async (file: File) => {
    setError(undefined);
    try {
      const { headers, rows } = await parseCSVFile(file);
      setCsvHeaders(headers);
      setCsvRows(rows);
      setCsvFileName(file.name);
      setCsvFileSize(file.size);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV file.");
    }
  };

  const handleConfirmImport = async () => {
    setError(undefined);
    setStep(3);
    
    try {
      const arrayRows = csvRows.map((row: Record<string, any>) => csvHeaders.map(h => row[h] ?? ''));
      const response = await processLeads(csvHeaders, arrayRows, csvFileName);
      
      setResults({
        totalRows: response.summary.totalRows,
        imported: response.summary.importedCount,
        skipped: response.summary.skippedCount,
        importedRecords: response.imported || [],
        skippedRecords: response.skipped || [],
      });
      
      setStep(4);
    } catch (err: any) {
      setError(err.message || "An error occurred during import.");
      setStep(2); // Go back to preview if error occurs, so they can try again
    }
  };

  const handleStartOver = () => {
    setStep(1);
    setCsvHeaders([]);
    setCsvRows([]);
    setCsvFileName('');
    setCsvFileSize(0);
    setError(undefined);
    setResults(null);
  };

  const handleClose = () => {
    handleStartOver();
    onClose();
  };

  const steps = [
    { id: 1, name: 'Upload' },
    { id: 2, name: 'Preview' },
    { id: 3, name: 'Processing' },
    { id: 4, name: 'Results' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${step === 1 ? 'max-w-[600px]' : step === 2 ? 'max-w-[700px]' : 'max-w-5xl'} max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all`}>
        
        {/* Dynamic Header */}
        {step === 1 && (
          <div className="flex items-start justify-between px-8 py-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Import Leads via CSV</h2>
              <p className="text-sm text-gray-500 font-medium">Add new contacts to your workspace in bulk.</p>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none -mr-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {step === 2 && (
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Preview Leads Import</h2>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none -mr-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {step > 2 && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Import Leads</h2>
              <nav aria-label="Progress" className="mt-1 hidden sm:block">
                <ol role="list" className="flex items-center space-x-2">
                  {steps.map((s, index) => (
                    <li key={s.name} className="flex items-center">
                      <span className={`text-xs font-semibold ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>
                        {s.id}. {s.name}
                      </span>
                      {index !== steps.length - 1 && (
                        <ChevronRight className="w-3 h-3 mx-2 text-gray-300" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 && (
            <UploadStep onFileAccepted={handleFileAccepted} error={error} onCancel={handleClose} />
          )}

          {step === 2 && (
             <PreviewStep 
               headers={csvHeaders} 
               rows={csvRows} 
               fileName={csvFileName}
               fileSize={csvFileSize}
               error={error} 
               onCancel={handleStartOver} 
               onConfirm={handleConfirmImport} 
             />
          )}

          <div className={step > 2 ? "p-6 md:p-8" : ""}>
            {step === 3 && (
              <ProcessingStep />
            )}

            {step === 4 && results && (
              <ResultsStep 
                results={results} 
                onStartOver={handleStartOver} 
                onClose={handleClose} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
