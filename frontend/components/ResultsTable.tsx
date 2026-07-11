import React from 'react';
import { CRMRecord } from '../types/crm';
import { StatusPill } from './StatusPill';

interface ResultsTableProps {
  records: CRMRecord[];
}

export function ResultsTable({ records }: ResultsTableProps) {
  if (records.length === 0) return null;

  const headers = ['Lead Name', 'Email', 'Phone', 'Company', 'Status'];

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white mb-6">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-800">Successfully Imported ({records.length})</h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.map((record, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {record.name || '-'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {record.email || '-'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {record.mobile_without_country_code ? `${record.country_code || ''} ${record.mobile_without_country_code}` : '-'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {record.company || '-'}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <StatusPill status={record.crm_status || 'DID_NOT_CONNECT'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
