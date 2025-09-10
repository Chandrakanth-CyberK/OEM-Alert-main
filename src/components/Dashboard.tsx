import React from 'react';
import { MetricCard } from './MetricCard';
import { VulnerabilityChart } from './VulnerabilityChart';
import { RecentAlerts } from './RecentAlerts';
import { CriticalDevices } from './CriticalDevices';
import { ComplianceStatus } from './ComplianceStatus';
import { useVulnerability } from '../context/VulnerabilityContext';
import { Shield, AlertTriangle, MonitorSpeaker, FileCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { vulnerabilities, criticalAlerts, totalDevices, complianceScore } = useVulnerability();

  const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highVulns = vulnerabilities.filter(v => v.severity === 'high').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Healthcare Security Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time vulnerability monitoring for medical infrastructure</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Critical Vulnerabilities"
          value={criticalVulns}
          icon={Shield}
          color="red"
          change={"+2 from yesterday"}
        />
        <MetricCard
          title="Active Alerts"
          value={criticalAlerts}
          icon={AlertTriangle}
          color="orange"
          change="3 require immediate action"
        />
        <MetricCard
          title="Medical Devices"
          value={totalDevices}
          icon={MonitorSpeaker}
          color="blue"
          change="127 online, 3 offline"
        />
        <MetricCard
          title="HIPAA Compliance"
          value={`${complianceScore}%`}
          icon={FileCheck}
          color="green"
          change="All systems compliant"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VulnerabilityChart />
        <ComplianceStatus />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlerts />
        <CriticalDevices />
      </div>
    </div>
  );
};