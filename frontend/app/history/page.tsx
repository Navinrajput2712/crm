"use client";

import React, { useState, useEffect } from 'react';
import { getBatches } from '../../lib/api';
import { AnimatedButton } from '../../components/AnimatedButton';
import { ImportModal } from '../../components/ImportModal/ImportModal';
import { FileText, Loader2, Calendar } from 'lucide-react';
import { ImportBatch } from '../../types/crm';

export default function HistoryPage() {
  const [batches, setBatches] = useState<ImportBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getBatches();
        setBatches(response.batches || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch import history.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBatches();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Import History
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View details of all your previous CSV imports.
          </p>
        </div>
        
        <AnimatedButton onClick={() => setIsModalOpen(true)}>
          Import CSV
        </AnimatedButton>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100 font-medium text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Rows</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Imported</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Skipped</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Loading history...</p>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-50 mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No imports yet</h3>
                    <p className="mt-2 text-sm text-gray-500 mb-6">
                      You haven't imported any leads via CSV yet.
                    </p>
                    <AnimatedButton onClick={() => setIsModalOpen(true)}>
                      Import CSV
                    </AnimatedButton>
                  </td>
                </tr>
              ) : (
                batches.map((batch, index) => (
                  <tr key={batch._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {batch.fileName || `import_${index}.csv`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {batch.totalRows || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {batch.totalImported || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {batch.totalSkipped || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ImportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
