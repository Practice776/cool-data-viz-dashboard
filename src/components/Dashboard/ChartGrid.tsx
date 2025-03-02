
import { motion } from 'framer-motion';
import TopicDistribution from './charts/TopicDistribution';
import YearlyTrend from './charts/YearlyTrend';
import CountryDistribution from './charts/CountryDistribution';
import IntensityDistribution from './charts/IntensityDistribution';
import RegionDistribution from './charts/RegionDistribution';
import SectorDistribution from './charts/SectorDistribution';
import RelevanceByTopic from './charts/RelevanceByTopic';
import LikelihoodDistribution from './charts/LikelihoodDistribution';

interface ChartGridProps {
  data: any;
  isLoading: boolean;
}

const ChartGrid = ({ data, isLoading }: ChartGridProps) => {
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

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 md:px-6 my-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <YearlyTrend data={data.yearTrend} />
        <TopicDistribution data={data.topicDistribution} />
        <CountryDistribution data={data.countryDistribution} />
        <RegionDistribution data={data.regionDistribution} />
        <IntensityDistribution data={data.intensityDistribution} />
        <LikelihoodDistribution data={data.likelihoodDistribution} />
        <SectorDistribution data={data.sectorDistribution} />
        <RelevanceByTopic data={data.relevanceByTopic} />
      </div>
    </motion.div>
  );
};

export default ChartGrid;
