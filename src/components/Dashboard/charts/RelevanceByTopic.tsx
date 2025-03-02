
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { RelevanceData } from '@/services/api';

interface RelevanceByTopicProps {
  data: RelevanceData[];
}

const RelevanceByTopic = ({ data }: RelevanceByTopicProps) => {
  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <h3 className="chart-title">Topic Relevance</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="topic" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Average Relevance', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: '12px', textAnchor: 'middle' }
              }}
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px', 
                padding: '8px 12px', 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f1f1f1',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              formatter={(value: number) => [value.toFixed(1), 'Average Relevance']}
              labelFormatter={(topic) => `Topic: ${topic}`}
            />
            <Bar 
              dataKey="avgRelevance" 
              fill="#1EAEDB" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RelevanceByTopic;
