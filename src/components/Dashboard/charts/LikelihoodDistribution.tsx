
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { LikelihoodData } from '@/services/api';

interface LikelihoodDistributionProps {
  data: LikelihoodData[];
}

const LikelihoodDistribution = ({ data }: LikelihoodDistributionProps) => {
  // Sort data by likelihood for better visualization
  const sortedData = [...data].sort((a, b) => a.likelihood - b.likelihood);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <h3 className="chart-title">Likelihood Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sortedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="likelihood" 
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
              labelFormatter={(likelihood) => `Likelihood: ${likelihood}`}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#F97316" 
              fill="#F97316"
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

export default LikelihoodDistribution;
