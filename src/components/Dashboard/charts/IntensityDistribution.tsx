
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { IntensityData } from '@/services/api';

interface IntensityDistributionProps {
  data: IntensityData[];
}

const IntensityDistribution = ({ data }: IntensityDistributionProps) => {
  // Sort data by intensity for better visualization
  const sortedData = [...data].sort((a, b) => a.intensity - b.intensity);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h3 className="chart-title">Intensity Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="intensity" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px', 
                padding: '8px 12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f1f1f1',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              formatter={(value: number) => [`${value} events`, 'Count']}
              labelFormatter={(intensity) => `Intensity: ${intensity}`}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#7E69AB" 
              fill="#9b87f5"
              fillOpacity={0.5}
              animationDuration={1500}
              animationBegin={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default IntensityDistribution;
