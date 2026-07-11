"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Database,
  User,
  LogOut,
  Search,
  Bell,
  HelpCircle,
  Settings
} from 'lucide-react';
import AuthGuard from './AuthGuard';
import { logout } from '../lib/auth';

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-20">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-600 tracking-tight">GrowEasy</h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">Workspace Owner</p>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 space-y-6 mt-2">
            <div>
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main</p>
              <div className="space-y-1">
                <Link
                  href="/"
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className={`w-5 h-5 mr-3 ${pathname === '/' ? 'text-blue-600' : 'text-gray-500'}`} />
                  Dashboard
                </Link>
                <Link
                  href="/leads"
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/leads'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className={`w-5 h-5 mr-3 ${pathname === '/leads' ? 'text-blue-600' : 'text-gray-500'}`} />
                  Manage Leads
                </Link>
              </div>
            </div>

            <div>
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Control Center</p>
              <div className="space-y-1">
                <Link
                  href="/history"
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/history'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Database className={`w-5 h-5 mr-3 ${pathname === '/history' ? 'text-blue-600' : 'text-gray-500'}`} />
                  Lead Sources
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 space-y-1">
            <Link
              href="/profile"
              className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <User className={`w-5 h-5 mr-3 ${pathname === '/profile' ? 'text-blue-600' : 'text-gray-500'}`} />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-500" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          {/* Header */}
          <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <span className="font-bold text-blue-600 text-lg">GrowEasy</span>
              
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search workspace..."
                  className="block w-full pl-9 pr-3 py-2 border-none rounded-md bg-[#EEF2FF] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-900"
                />
              </div>

              <div className="flex items-center gap-4 text-gray-500">
                <button className="hover:text-gray-700 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="hover:text-gray-700 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button className="hover:text-gray-700 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
