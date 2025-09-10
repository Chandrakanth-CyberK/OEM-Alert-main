import React from 'react';
import { User, Shield, Bell, Settings, Key, Download } from 'lucide-react';
import { useUser } from '../context/UserContext';

export const UserProfile: React.FC = () => {
  const { user } = useUser();

  const permissions = [
    'View vulnerability reports',
    'Manage medical device inventory',
    'Configure alert settings',
    'Export compliance reports',
    'Access patient safety data',
    'Manage HIPAA compliance tracking'
  ];

  const recentActivity = [
    {
      action: 'Viewed critical vulnerability',
      details: 'CVE-2024-1234 - Philips IntelliVue Monitor',
      timestamp: '2 hours ago'
    },
    {
      action: 'Delegated alert management',
      details: 'Assigned K.Chandrakanth as Deputy CISO for alert coordination',
      timestamp: '1 day ago'
    },
    {
      action: 'Generated compliance report',
      details: 'HIPAA Security Rule Assessment Q1 2024',
      timestamp: '3 days ago'
    },
    {
      action: 'Security team meeting',
      details: 'Reviewed vulnerability response protocols with K.Chandrakanth',
      timestamp: '1 week ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account settings and security preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={user.department}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h3>
            </div>
            
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Notification Preferences</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Configure</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Key className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Security Settings</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Manage</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Download className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Export Data</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Download</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Statistics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vulnerabilities Reviewed</span>
                <span className="text-lg font-bold text-blue-600">127</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reports Generated</span>
                <span className="text-lg font-bold text-green-600">24</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Days Active</span>
                <span className="text-lg font-bold text-purple-600">89</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                <span className="text-sm text-gray-900 dark:text-white">Today, 9:15 AM</span>
              </div>
            </div>
          </div>

          {/* HIPAA Compliance Badge */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">HIPAA Certified</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-400">
              This user account is certified for handling protected health information (PHI) 
              in compliance with HIPAA regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};