import React from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

interface SummaryBarProps {
  totalRows: number;
  imported: number;
  skipped: number;
}

export function SummaryBar({ totalRows, imported, skipped }: SummaryBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl p-5 flex items-center shadow-sm border border-gray-100">
        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Imported</p>
          <p className="text-2xl font-bold text-gray-900">{imported}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-5 flex items-center shadow-sm border border-gray-100">
        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Skipped</p>
          <p className="text-2xl font-bold text-gray-900">{skipped}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-5 flex items-center shadow-sm border border-gray-100">
        <div className="p-3 rounded-full bg-blue-100 text-primary mr-4">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Rows</p>
          <p className="text-2xl font-bold text-gray-900">{totalRows}</p>
        </div>
      </div>
    </div>
  );
}
