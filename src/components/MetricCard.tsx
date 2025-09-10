import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'red' | 'orange' | 'blue' | 'green';
  change?: string;
}

const colorClasses = {
  red: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
  orange: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400',
  blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
  green: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400',
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, change }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {change && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};