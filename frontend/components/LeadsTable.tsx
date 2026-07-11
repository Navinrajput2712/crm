import React from 'react';
import { LeadItem } from '../types/crm';
import { StatusPill } from './StatusPill';
import { AnimatedButton } from './AnimatedButton';
import { Loader2, Mail, Phone, Calendar, Building, MoreHorizontal } from 'lucide-react';

interface LeadsTableProps {
  leads: LeadItem[];
  isLoading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function LeadsTable({ leads, isLoading, onLoadMore, hasMore }: LeadsTableProps) {
  if (leads.length === 0 && !isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <Mail className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          We couldn't find any leads matching your criteria. Try adjusting your search or import some new leads.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Lead Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Email</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date Created</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Company</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead, index) => (
              <tr key={`${lead._id}-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    {lead.email ? <Mail className="w-4 h-4 mr-2 text-gray-400" /> : null}
                    {lead.email || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    {lead.mobile_without_country_code ? <Phone className="w-4 h-4 mr-2 text-gray-400" /> : null}
                    {lead.mobile_without_country_code ? `${lead.country_code || ''} ${lead.mobile_without_country_code}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    {lead.created_at ? <Calendar className="w-4 h-4 mr-2 text-gray-400" /> : null}
                    {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center">
                    {lead.company ? <Building className="w-4 h-4 mr-2 text-gray-400" /> : null}
                    {lead.company || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusPill status={lead.crm_status || 'DID_NOT_CONNECT'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                  <button className="text-gray-400 hover:text-primary focus:outline-none transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center p-6 border-t border-gray-100">
          <Loader2 className="w-5 h-5 text-primary animate-spin mr-3" />
          <span className="text-sm text-gray-500">Loading leads...</span>
        </div>
      )}
      
      {hasMore && !isLoading && (
        <div className="flex justify-center p-4 border-t border-gray-100 bg-gray-50/30">
          <AnimatedButton variant="secondary" onClick={onLoadMore}>
            Load More Leads
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
