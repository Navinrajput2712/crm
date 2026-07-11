"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { LeadsTable } from '../../components/LeadsTable';
import { getLeads } from '../../lib/api';
import { LeadItem } from '../../types/crm';
import { Search, AlertCircle } from 'lucide-react';

const LIMIT = 20;

export default function ManageLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchLeads = useCallback(async (isLoadMore = false) => {
    setIsLoading(true);
    if (!isLoadMore) setError(null);
    
    try {
      const response = await getLeads(debouncedSearch, isLoadMore ? offset : 0, LIMIT);
      
      const newLeads = response.leads || [];
      if (isLoadMore) {
        setLeads(prev => [...prev, ...newLeads]);
      } else {
        setLeads(newLeads);
      }
      
      setHasMore(newLeads.length === LIMIT && (response.total ? (isLoadMore ? offset : 0) + newLeads.length < response.total : true));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, offset]);

  useEffect(() => {
    setOffset(0);
    fetchLeads(false);
  }, [debouncedSearch]);

  useEffect(() => {
    if (offset > 0) {
      fetchLeads(true);
    }
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(prev => prev + LIMIT);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Manage Leads
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View, search, and manage all your imported leads.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors text-gray-900 shadow-sm"
            placeholder="Enter email or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && !leads.length && (
        <div className="rounded-xl bg-red-50 p-6 mb-8 border border-red-100 flex items-center shadow-sm">
          <AlertCircle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Failed to load leads</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <LeadsTable 
        leads={leads} 
        isLoading={isLoading} 
        onLoadMore={handleLoadMore} 
        hasMore={hasMore} 
      />
    </div>
  );
}
