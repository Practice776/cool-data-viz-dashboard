
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { CountryData } from '@/services/api';

interface CountryDistributionProps {
  data: CountryData[];
}

const CountryDistribution = ({ data }: CountryDistributionProps) => {
  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="chart-title">Top Countries by Event Count</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="country" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={100}
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
              labelFormatter={(country) => `Country: ${country}`}
            />
            <Bar 
              dataKey="count" 
              name="Events"
              fill="#9b87f5" 
              radius={[0, 4, 4, 0]}
              animationDuration={1500}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CountryDistribution;
