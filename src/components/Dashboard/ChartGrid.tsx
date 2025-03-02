
import { motion } from 'framer-motion';
import TopicDistribution from './charts/TopicDistribution';
import YearlyTrend from './charts/YearlyTrend';
import CountryDistribution from './charts/CountryDistribution';
import IntensityDistribution from './charts/IntensityDistribution';
import RegionDistribution from './charts/RegionDistribution';
import SectorDistribution from './charts/SectorDistribution';
import RelevanceByTopic from './charts/RelevanceByTopic';
import LikelihoodDistribution from './charts/LikelihoodDistribution';
import { FilterParams } from '@/services/api';

interface ChartGridProps {
  data: any;
  isLoading: boolean;
  filters: FilterParams;
}

const ChartGrid = ({ data, isLoading, filters }: ChartGridProps) => {
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-6 my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="dashboard-chart animate-pulse-slow"
              style={{ height: '300px' }}
            >
              <div className="w-1/2 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="flex-1 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Check if we have any active filters to display
  const hasFilters = Object.values(filters).some(filter => filter);

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 md:px-6 my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {hasFilters && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
          <h3 className="text-lg font-medium">Filtered Visualization</h3>
          <p className="text-sm">
            Showing results for: {
              Object.entries(filters)
                .filter(([_, value]) => value)
                .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
                .join(', ')
            }
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <YearlyTrend data={data.yearTrend} />
        <TopicDistribution data={data.topicDistribution} activeFilter={filters.topic || ""} />
        <CountryDistribution data={data.countryDistribution} activeFilter={filters.country || ""} />
        <RegionDistribution data={data.regionDistribution} activeFilter={filters.region || ""} />
        <IntensityDistribution data={data.intensityDistribution} />
        <LikelihoodDistribution data={data.likelihoodDistribution} />
        <SectorDistribution data={data.sectorDistribution} activeFilter={filters.sector || ""} />
        <RelevanceByTopic data={data.relevanceByTopic} activeFilter={filters.topic || ""} />
      </div>
    </motion.div>
  );
};

export default ChartGrid;
