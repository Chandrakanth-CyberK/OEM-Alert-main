import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { VulnerabilityList } from './components/VulnerabilityList';
import { DeviceInventory } from './components/DeviceInventory';
import { AlertCenter } from './components/AlertCenter';
import { ComplianceHub } from './components/ComplianceHub';
import { UserProfile } from './components/UserProfile';
import { VulnerabilityProvider } from './context/VulnerabilityContext';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <VulnerabilityProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header 
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              onViewChange={setActiveView}
            />
            
            <div className="flex">
              <Sidebar 
                collapsed={sidebarCollapsed}
                activeView={activeView}
                onViewChange={setActiveView}
              />
              
              <main className={`flex-1 transition-all duration-300 ${
                sidebarCollapsed ? 'ml-16' : 'ml-64'
              } pt-16`}>
                <div className="p-6">
                  {activeView === 'dashboard' && <Dashboard />}
                  {activeView === 'vulnerabilities' && <VulnerabilityList />}
                  {activeView === 'devices' && <DeviceInventory />}
                  {activeView === 'alerts' && <AlertCenter />}
                  {activeView === 'compliance' && <ComplianceHub />}
                  {activeView === 'profile' && <UserProfile />}
                </div>
              </main>
            </div>
          </div>
        </VulnerabilityProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;