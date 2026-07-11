"use client";

import React, { useState, useEffect } from 'react';
import { getLeads, getBatches } from '../lib/api';
import { ImportModal } from '../components/ImportModal/ImportModal';
import { User, Upload, CheckCircle2, Clock } from 'lucide-react';
import { LeadItem, ImportBatch } from '../types/crm';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<LeadItem[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    importedThisMonth: 0,
    goodLeads: 0,
    pendingFollowUps: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [allLeadsRes, recentLeadsRes, batchesRes] = await Promise.all([
          getLeads('', 0, 1000).catch(() => ({ leads: [], total: 0 })),
          getLeads('', 0, 20).catch(() => ({ leads: [], total: 0 })),
          getBatches().catch(() => ({ batches: [] }))
        ]);
        
        const allLeads = allLeadsRes.leads || [];
        setRecentLeads(recentLeadsRes.leads || []);
        
        const goodLeadsCount = allLeads.filter((l) => l.crm_status === 'GOOD_LEAD_FOLLOW_UP').length;
        const pendingCount = allLeads.filter((l) => l.crm_status === 'DID_NOT_CONNECT').length;
        
        setStats({
          totalLeads: allLeadsRes.total || 0,
          importedThisMonth: batchesRes.batches?.reduce((acc: number, b: ImportBatch) => acc + (b.totalImported || 0), 0) || 0,
          goodLeads: goodLeadsCount, 
          pendingFollowUps: pendingCount 
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Here's what's happening with your leads today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="TOTAL LEADS" 
          value={stats.totalLeads} 
          icon={User} 
          color="blue"
          isLoading={isLoading} 
        />
        <StatCard 
          title="IMPORTED" 
          value={stats.importedThisMonth} 
          icon={Upload} 
          color="blue"
          isLoading={isLoading} 
        />
        <StatCard 
          title="GOOD LEADS" 
          value={stats.goodLeads} 
          icon={CheckCircle2} 
          color="green"
          isLoading={isLoading} 
        />
        <StatCard 
          title="PENDING FOLLOW-UPS" 
          value={stats.pendingFollowUps} 
          icon={Clock} 
          color="orange"
          isLoading={isLoading} 
        />
      </div>

      {/* Import CTA Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Import leads from a CSV</h2>
          <p className="text-sm text-gray-500">
            Upload your spreadsheet and AI will map columns to CRM fields automatically.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Import CSV
          </button>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
          <a href="/leads" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View All Leads
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">EMAIL</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">PHONE</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">COMPANY</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">STATUS</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">DATE</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : recentLeads.length > 0 ? (
                recentLeads.map((lead, i) => (
                  <tr key={lead._id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lead.name || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.email || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.mobile_without_country_code ? `${lead.country_code || ''} ${lead.mobile_without_country_code}` : '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-600">
                      {lead.company || '-'}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-center">
                      <StatusPill status={lead.crm_status || 'DID_NOT_CONNECT'} />
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-500 text-right">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="text-gray-400 mb-3">
                      <Upload className="w-10 h-10 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No leads yet</p>
                    <p className="text-xs text-gray-400 mt-1">Import a CSV file to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {recentLeads.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <a href="/leads" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              View all {stats.totalLeads} leads →
            </a>
          </div>
        )}
      </div>

      <ImportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, isLoading }: { title: string, value: number, icon: any, color: 'blue' | 'green' | 'orange', isLoading: boolean }) {
  const colors = {
    blue: { text: 'text-blue-600', icon: 'text-blue-600' },
    green: { text: 'text-green-600', icon: 'text-green-600' },
    orange: { text: 'text-orange-500', icon: 'text-orange-500' }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start">
        <p className="text-xs font-bold text-gray-500 tracking-wider w-2/3">{title}</p>
        <Icon className={`w-5 h-5 ${colors[color].icon}`} strokeWidth={2.5} />
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <p className={`text-4xl font-bold ${colors[color].text}`}>
            {value.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  let colorClass = 'bg-[#94A3B8] text-white';
  let label = status;
  
  if (status === 'SALE_DONE') {
    colorClass = 'bg-blue-600 text-white';
    label = 'SALE DONE';
  } else if (status === 'GOOD_LEAD_FOLLOW_UP') {
    colorClass = 'bg-[#16A34A] text-white';
    label = 'GOOD LEAD';
  } else if (status === 'BAD_LEAD') {
    colorClass = 'bg-[#F87171] text-white';
    label = 'BAD LEAD';
  } else if (status === 'DID_NOT_CONNECT') {
    colorClass = 'bg-[#94A3B8] text-white';
    label = 'NOT DIALED';
  }

  return (
    <span className={`px-3 py-1 inline-flex text-[10px] font-bold rounded-full uppercase tracking-wider ${colorClass}`}>
      {label}
    </span>
  );
}
