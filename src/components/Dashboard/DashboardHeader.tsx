
import { motion } from 'framer-motion';
import { BarChart2, LayoutDashboard } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <motion.header 
      className="py-8 px-6 md:px-8 mb-4 bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md bg-opacity-80"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container flex flex-col md:flex-row justify-between items-center max-w-7xl">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-dashboard-primary bg-opacity-10 p-3 rounded-xl mr-4">
            <BarChart2 className="h-6 w-6 text-dashboard-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-dashboard-darkgray">Data Visualization Dashboard</h1>
            <p className="text-dashboard-neutral text-sm">Interactive insights and trends</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="bg-dashboard-lightgray p-2 rounded-lg flex items-center">
            <LayoutDashboard className="h-4 w-4 text-dashboard-neutral mr-2" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
