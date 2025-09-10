import React from 'react';
import { Bell, Menu, Shield, User, Moon, Sun, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useVulnerability } from '../context/VulnerabilityContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onViewChange }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useUser();
  const { criticalAlerts } = useVulnerability();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">OEMAlert</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Security Monitor</p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vulnerabilities, devices, CVE IDs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <button 
            onClick={() => onViewChange('alerts')}
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {criticalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs 
                               rounded-full flex items-center justify-center font-medium">
                {criticalAlerts}
              </span>
            )}
          </button>

          <button 
            onClick={() => onViewChange('profile')}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};