
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { RegionData } from '@/services/api';

interface RegionDistributionProps {
  data: RegionData[];
}

const COLORS = ['#9b87f5', '#1EAEDB', '#F97316', '#7E69AB', '#2F4858', '#7F8EAD', '#E1E7F5'];

const RegionDistribution = ({ data }: RegionDistributionProps) => {
  // Take only top regions for cleaner visualization
  const topData = data.slice(0, 7);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="chart-title">Region Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              animationDuration={1500}
              animationBegin={300}
              label
            >
              {topData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                padding: '8px 12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f1f1f1',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              formatter={(value: number) => [`${value} events`, 'Count']}
              labelFormatter={(name) => `Region: ${name}`}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RegionDistribution;
