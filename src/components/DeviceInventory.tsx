import React, { useState } from 'react';
import { MonitorSpeaker, Search, Plus, Filter, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useVulnerability } from '../context/VulnerabilityContext';

export const DeviceInventory: React.FC = () => {
  const { medicalDevices } = useVulnerability();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredDevices = medicalDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || device.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'offline': return AlertCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return MonitorSpeaker;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400';
      case 'offline': return 'text-gray-600 dark:text-gray-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Critical Care': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Diagnostic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Treatment': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'IT Systems': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Device Inventory</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage medical devices across your healthcare facility</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Device</span>
        </button>
      </div>

      {/* Device Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{medicalDevices.length}</p>
            </div>
            <MonitorSpeaker className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Online</p>
              <p className="text-3xl font-bold text-green-600">{medicalDevices.filter(d => d.status === 'online').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Vulnerabilities</p>
              <p className="text-3xl font-bold text-orange-600">{medicalDevices.filter(d => d.vulnerabilityCount > 0).length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Status</p>
              <p className="text-3xl font-bold text-red-600">{medicalDevices.filter(d => d.status === 'critical').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search devices, models, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="Critical Care">Critical Care</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Treatment">Treatment</option>
              <option value="IT Systems">IT Systems</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => {
          const StatusIcon = getStatusIcon(device.status);
          return (
            <div key={device.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MonitorSpeaker className="h-8 w-8 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{device.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{device.model}</p>
                  </div>
                </div>
                <StatusIcon className={`h-5 w-5 ${getStatusColor(device.status)}`} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(device.category)}`}>
                    {device.category}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {device.status}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{device.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Manufacturer:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{device.manufacturer}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(device.lastUpdated).toLocaleDateString()}
                  </span>
                </div>

                {device.vulnerabilityCount > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-900 dark:text-red-300">
                        {device.vulnerabilityCount} Vulnerabilities
                      </span>
                    </div>
                    <button className="text-xs text-red-600 dark:text-red-400 hover:underline">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <MonitorSpeaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No devices found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};