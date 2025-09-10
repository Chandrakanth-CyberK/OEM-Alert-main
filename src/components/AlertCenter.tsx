import React, { useState } from 'react';
import { Bell, Settings, Mail, Smartphone, MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const AlertCenter: React.FC = () => {
  const { vulnerabilities } = useVulnerability();
  const [activeTab, setActiveTab] = useState('active');

  const activeAlerts = vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high');
  const resolvedAlerts = vulnerabilities.filter(v => v.severity === 'low');

  const alertChannels = [
    { id: 'email', name: 'Email Notifications', icon: Mail, enabled: true },
    { id: 'sms', name: 'SMS Alerts', icon: Smartphone, enabled: true },
    { id: 'teams', name: 'Microsoft Teams', icon: MessageSquare, enabled: false },
    { id: 'paging', name: 'Hospital Paging', icon: Bell, enabled: true },
  ];

  const alertRules = [
    { name: 'Life-Critical Device Vulnerabilities', severity: 'immediate', enabled: true },
    { name: 'Patient Data Breach Risk', severity: 'immediate', enabled: true },
    { name: 'ICU Equipment Alerts', severity: 'high', enabled: true },
    { name: 'HIPAA Compliance Violations', severity: 'high', enabled: true },
    { name: 'Non-Critical System Updates', severity: 'low', enabled: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alert Management Center</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure and manage security alerts for healthcare infrastructure</p>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
              <p className="text-3xl font-bold text-red-600">{activeAlerts.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Today</p>
              <p className="text-3xl font-bold text-green-600">12</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
              <p className="text-3xl font-bold text-blue-600">8m</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alert Channels</p>
              <p className="text-3xl font-bold text-purple-600">{alertChannels.filter(c => c.enabled).length}</p>
            </div>
            <Bell className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alert Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Channels</h3>
            <Settings className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {alertChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="capitalize">Assigned: K.Chandrakanth (Deputy CISO)</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={channel.enabled}
                      readOnly
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alert Rules</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
              Add Rule
            </button>
          </div>

          <div className="space-y-4">
            {alertRules.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{rule.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    Priority: {rule.severity}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={rule.enabled}
                    readOnly
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Active ({activeAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Resolved (12)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {(activeTab === 'active' ? activeAlerts : resolvedAlerts).slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-shrink-0">
                {activeTab === 'active' ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">{alert.cveId}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.severity === 'critical' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {alert.affectedDevice} - {alert.description.substring(0, 100)}...
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>{new Date(alert.publishedDate).toLocaleString()}</span>
                  <span className="capitalize">{alert.department}</span>
                  <span className="capitalize">Patient Impact: {alert.patientSafetyImpact}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                  {activeTab === 'active' ? 'Acknowledge' : 'View'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};