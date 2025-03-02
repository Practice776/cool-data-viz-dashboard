
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { YearData } from '@/services/api';

interface YearlyTrendProps {
  data: YearData[];
}

const YearlyTrend = ({ data }: YearlyTrendProps) => {
  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="chart-title">Yearly Trends</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#8E9196' }}
              axisLine={{ stroke: '#8E9196' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#8E9196' }}
              axisLine={{ stroke: '#8E9196' }}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px', 
                padding: '8px 12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f1f1f1',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              formatter={(value: number) => [value.toFixed(1), '']}
              labelFormatter={(year) => `Year: ${year}`}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Line 
              type="monotone" 
              dataKey="avgIntensity" 
              name="Avg. Intensity"
              stroke="#9b87f5" 
              activeDot={{ r: 6 }}
              strokeWidth={2} 
              animationDuration={1500}
              animationBegin={300}
            />
            <Line 
              type="monotone" 
              dataKey="avgLikelihood" 
              name="Avg. Likelihood"
              stroke="#1EAEDB" 
              strokeWidth={2} 
              animationDuration={1500}
              animationBegin={600}
            />
            <Line 
              type="monotone" 
              dataKey="avgRelevance" 
              name="Avg. Relevance"
              stroke="#F97316" 
              strokeWidth={2} 
              animationDuration={1500}
              animationBegin={900}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default YearlyTrend;
