
import { useEffect, useState } from 'react';
import { useDataFetching } from '@/hooks/useDataFetching';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import FilterPanel from '@/components/Dashboard/FilterPanel';
import ChartGrid from '@/components/Dashboard/ChartGrid';
import { authAPI } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { data, filters, isLoading, applyFilters, resetFilters } = useDataFetching();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authAPI.checkAuth();
      setIsAuthenticated(isAuth);
      setIsAuthLoading(false);
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsAuthLoading(true);
      await authAPI.login(username, password);
      setIsAuthenticated(true);
      toast.success('Successfully logged in');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-dashboard-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
        <motion.div 
          className="w-full max-w-md p-8 bg-white rounded-xl shadow-glass border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-center mb-6">
            <div className="inline-block bg-dashboard-primary bg-opacity-10 p-3 rounded-xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dashboard-primary">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                <line x1="3" x2="21" y1="9" y2="9"></line>
                <line x1="9" x2="9" y1="21" y2="9"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-dashboard-darkgray">Dashboard Login</h2>
            <p className="text-dashboard-neutral text-sm mt-1">Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dashboard-primary focus:border-transparent transition-all"
                placeholder="admin"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dashboard-primary focus:border-transparent transition-all"
                placeholder="password123"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-dashboard-primary hover:bg-dashboard-secondary"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : 'Log In'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-dashboard-neutral">
            <p>Default credentials: admin / password123</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <DashboardHeader />
      
      <div className="py-6">
        <FilterPanel 
          filters={filters} 
          onApplyFilters={applyFilters} 
          onResetFilters={resetFilters} 
        />
        
        <ChartGrid data={data} isLoading={isLoading} filters={filters} />
      </div>
    </div>
  );
};

export default Index;
