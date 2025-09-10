import React from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const ComplianceStatus: React.FC = () => {
  const { complianceScore } = useVulnerability();

  const complianceItems = [
    { name: 'Access Control', status: 'compliant', score: 98 },
    { name: 'Audit Controls', status: 'compliant', score: 95 },
    { name: 'Integrity', status: 'warning', score: 87 },
    { name: 'Person Authentication', status: 'compliant', score: 100 },
    { name: 'Transmission Security', status: 'review', score: 78 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'review': return Clock;
      default: return Shield;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'review': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HIPAA Compliance Status</h3>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-2xl font-bold text-green-600">{complianceScore}%</span>
        </div>
      </div>

      <div className="space-y-4">
        {complianceItems.map((item) => {
          const StatusIcon = getStatusIcon(item.status);
          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.score >= 95 ? 'bg-green-500' : 
                      item.score >= 80 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                  {item.score}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Next Compliance Review
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Scheduled for March 15, 2024 • Risk Management Team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};