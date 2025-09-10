import React from 'react';
import { 
  LayoutDashboard, 
  Shield, 
  MonitorSpeaker, 
  Bell, 
  FileCheck, 
  Users,
  Stethoscope,
  Activity,
  Zap,
  Building2
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  activeView: string;
  onViewChange: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Shield },
  { id: 'devices', label: 'Medical Devices', icon: MonitorSpeaker },
  { id: 'alerts', label: 'Alert Center', icon: Bell },
  { id: 'compliance', label: 'HIPAA Compliance', icon: FileCheck },
];

const departmentItems = [
  { id: 'icu', label: 'Critical Care', icon: Activity },
  { id: 'emergency', label: 'Emergency', icon: Zap },
  { id: 'surgery', label: 'Surgery', icon: Stethoscope },
  { id: 'radiology', label: 'Radiology', icon: MonitorSpeaker },
  { id: 'lab', label: 'Laboratory', icon: Building2 },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, activeView, onViewChange }) => {
  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <nav className="flex-1 py-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3 font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {!collapsed && (
            <div className="mt-8">
              <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Departments
              </h3>
              <div className="mt-3 space-y-1">
                {departmentItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange('vulnerabilities')}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                                 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="ml-3 text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">HIPAA Compliant</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">All data encrypted</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};