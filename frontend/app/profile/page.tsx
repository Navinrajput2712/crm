"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/auth';
import { User, Mail, Calendar, LogOut, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-gray-500">Manage your account settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Avatar Section */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.email}</h2>
              <p className="text-sm text-gray-500 mt-1">Workspace Owner</p>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="px-8 py-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Account Details</h3>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Email Address</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 font-medium">User ID</p>
              <p className="text-sm font-semibold text-gray-900 font-mono">{user.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Role</p>
              <p className="text-sm font-semibold text-gray-900">Administrator</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
