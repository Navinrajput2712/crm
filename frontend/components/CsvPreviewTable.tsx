import React from 'react';

interface CsvPreviewTableProps {
  headers: string[];
  rows: any[];
}

export function CsvPreviewTable({ headers, rows }: CsvPreviewTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white">
      <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
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
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-3 whitespace-nowrap text-sm text-gray-700"
                  >
                    {row[header] !== undefined && row[header] !== null ? String(row[header]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
