import React from 'react';
import { AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const RecentAlerts: React.FC = () => {
  const { vulnerabilities } = useVulnerability();
  
  const recentAlerts = vulnerabilities
    .filter(v => v.severity === 'critical' || v.severity === 'high')
    .slice(0, 5)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Critical Alerts</h3>
        <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {alert.cveId}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {alert.description}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(alert.publishedDate).toLocaleDateString()}
                  </span>
                  <span>{alert.affectedDevice}</span>
                  <span className="capitalize">{alert.department}</span>
                </div>
                
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};