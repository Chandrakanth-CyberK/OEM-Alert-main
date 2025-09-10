import React from 'react';
import { MonitorSpeaker, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const CriticalDevices: React.FC = () => {
  const { medicalDevices } = useVulnerability();
  
  const criticalDevices = medicalDevices
    .filter(device => device.category === 'Critical Care')
    .slice(0, 6);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'online': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return AlertCircle;
      case 'warning': return Clock;
      case 'online': return CheckCircle;
      default: return MonitorSpeaker;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Critical Care Devices</h3>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          View Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {criticalDevices.map((device) => {
          const StatusIcon = getStatusIcon(device.status);
          return (
            <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center space-x-3">
                <MonitorSpeaker className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {device.location} • {device.model}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {device.vulnerabilityCount > 0 && (
                  <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-full">
                    {device.vulnerabilityCount} vulns
                  </span>
                )}
                <StatusIcon className={`h-4 w-4 ${getStatusColor(device.status)}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};