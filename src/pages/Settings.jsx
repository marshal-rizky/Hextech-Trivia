import React from 'react';
import { User, Shield, Bell, Palette, Monitor, LogOut } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Maker Settings</h1>
        <p className="text-gray-400">Configure your Hextech Toolkit preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--color-navy)] text-[var(--color-hextech-blue)] rounded-lg border border-[var(--color-glass-border)] shadow-md transition-all">
            <User className="w-5 h-5" />
            <span className="font-medium">Account Profile</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[var(--color-navy)] hover:text-white rounded-lg transition-all">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Security</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[var(--color-navy)] hover:text-white rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="font-medium">Notifications</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-[var(--color-navy)] hover:text-white rounded-lg transition-all">
            <Palette className="w-5 h-5" />
            <span className="font-medium">Appearance</span>
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-[var(--color-glass-border)] pb-4">Profile Information</h2>
            
            <div className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-[var(--color-gold)] overflow-hidden bg-[var(--color-deep-navy)] flex items-center justify-center relative">
                    <User className="text-gray-400 w-12 h-12" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-xs text-white font-medium">Change Avatar</span>
                    </div>
                  </div>
                  {/* Rank Badge Indicator */}
                  <div className="absolute -bottom-2 -right-2 bg-[var(--color-navy)] border-2 border-[var(--color-hextech-blue)] rounded-full p-2">
                    <Shield className="w-4 h-4 text-[var(--color-hextech-blue)]" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white">{user?.username || 'Summoner'}</h3>
                  <p className="text-sm text-[var(--color-gold)] mb-2 uppercase tracking-tighter">
                    {user?.role === 'guest' ? 'Guest Wanderer' : 'Grandmaster Quiz Creator'}
                  </p>
                  <Button variant="secondary" className="px-4 py-2 text-xs">Upgrade Tier</Button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Summoner Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.username || ''}
                    className="w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] focus:ring-1 focus:ring-[var(--color-hextech-blue)] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="maker@runeterra.com"
                    className="w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] focus:ring-1 focus:ring-[var(--color-hextech-blue)] transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Creator Bio</label>
                  <textarea 
                    rows="4"
                    defaultValue="Lore enthusiast crafting the hardest Runeterra trials."
                    className="w-full bg-[var(--color-navy)] border border-[var(--color-glass-border)] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[var(--color-hextech-blue)] focus:ring-1 focus:ring-[var(--color-hextech-blue)] transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Changes</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/50 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Log Out</h3>
                <p className="text-sm text-gray-400">Disconnect from the Hextech Network.</p>
              </div>
              <Button 
                variant="danger" 
                className="px-4 py-2"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Settings;
