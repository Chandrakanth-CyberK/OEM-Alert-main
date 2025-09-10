import React from 'react';
import { Shield, FileCheck, AlertTriangle, CheckCircle, Download, Calendar } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const ComplianceHub: React.FC = () => {
  const { complianceScore } = useVulnerability();

  const hipaaRequirements = [
    {
      section: '§164.308(a)(1)(i)',
      name: 'Security Officer',
      status: 'compliant',
      description: 'Assign security responsibility to an individual',
      lastReview: '2024-01-15',
      nextReview: '2024-07-15'
    },
    {
      section: '§164.308(a)(5)(ii)(D)',
      name: 'Password Management',
      status: 'compliant',
      description: 'Procedures for creating, changing, and safeguarding passwords',
      lastReview: '2024-02-01',
      nextReview: '2024-08-01'
    },
    {
      section: '§164.312(a)(1)',
      name: 'Access Control',
      status: 'warning',
      description: 'Unique user identification, emergency access, automatic logoff',
      lastReview: '2024-01-10',
      nextReview: '2024-07-10'
    },
    {
      section: '§164.312(c)(1)',
      name: 'Integrity Controls',
      status: 'review',
      description: 'Protect electronic PHI from improper alteration or destruction',
      lastReview: '2023-12-20',
      nextReview: '2024-06-20'
    },
    {
      section: '§164.312(e)(1)',
      name: 'Transmission Security',
      status: 'compliant',
      description: 'Guard against unauthorized access to PHI during transmission',
      lastReview: '2024-02-10',
      nextReview: '2024-08-10'
    }
  ];

  const complianceMetrics = [
    { name: 'Risk Assessments Completed', value: '24/24', status: 'compliant' },
    { name: 'Staff Training Completion', value: '98%', status: 'compliant' },
    { name: 'Incident Response Drills', value: '4/4', status: 'compliant' },
    { name: 'Vendor Risk Assessments', value: '12/15', status: 'warning' },
    { name: 'Policy Updates', value: '18/20', status: 'warning' },
    { name: 'Audit Documentation', value: 'Current', status: 'compliant' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'review': return Calendar;
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

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20';
      case 'review': return 'bg-blue-50 dark:bg-blue-900/20';
      default: return 'bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HIPAA Compliance Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage healthcare compliance requirements</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Compliance Score</h3>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="text-3xl font-bold text-green-600">{complianceScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complianceMetrics.map((metric, index) => {
            const StatusIcon = getStatusIcon(metric.status);
            return (
              <div key={index} className={`p-4 rounded-lg ${getStatusBg(metric.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{metric.name}</h4>
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* HIPAA Requirements Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HIPAA Security Rule Compliance</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <FileCheck className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div className="space-y-4">
          {hipaaRequirements.map((requirement, index) => {
            const StatusIcon = getStatusIcon(requirement.status);
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {requirement.section}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {requirement.name}
                      </span>
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(requirement.status)}`} />
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {requirement.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Last Review: {new Date(requirement.lastReview).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Next Review: {new Date(requirement.nextReview).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      requirement.status === 'compliant' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : requirement.status === 'warning'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {requirement.status}
                    </span>
                    <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compliance Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Actions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900 dark:text-orange-300">
                  Complete vendor risk assessments (3 pending)
                </span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400">Due: Mar 20</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Review integrity controls documentation
                </span>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400">Due: Mar 25</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileCheck className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                  Update 2 outstanding policies
                </span>
              </div>
              <span className="text-xs text-yellow-600 dark:text-yellow-400">Due: Apr 1</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Compliance Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  Annual risk assessment completed
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Completed on Mar 10, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  Staff security training updated
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">Completed on Mar 8, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Quarterly incident response drill scheduled
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Scheduled for Mar 22, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};