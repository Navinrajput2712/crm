import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface SkippedRecord {
  row: any;
  reason: string;
}

interface SkippedRecordsListProps {
  skipped: SkippedRecord[];
}

export function SkippedRecordsList({ skipped }: SkippedRecordsListProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (skipped.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-red-200 bg-white overflow-hidden mb-6 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-red-50/50 hover:bg-red-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2.5" />
          <span className="font-semibold text-red-700">
            Skipped Records ({skipped.length})
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-red-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 border-t border-red-100">
          <div className="space-y-4">
            {skipped.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-red-600 mb-2.5">
                  Reason: {item.reason}
                </p>
                <div className="bg-white p-3 rounded-md overflow-x-auto border border-gray-200">
                  <pre className="text-xs text-gray-700 font-mono">
                    {JSON.stringify(item.row, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
