
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { SectorData } from '@/services/api';

interface SectorDistributionProps {
  data: SectorData[];
}

const SectorDistribution = ({ data }: SectorDistributionProps) => {
  const transformedData = data.map(item => ({
    subject: item.name,
    value: item.value,
    fullMark: Math.max(...data.map(d => d.value)) * 1.2
  }));

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3 className="chart-title">Sector Distribution</h3>
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={90} data={transformedData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
            <Radar 
              name="Events" 
              dataKey="value" 
              stroke="#9b87f5" 
              fill="#9b87f5" 
              fillOpacity={0.5}
              animationDuration={1500}
              animationBegin={300} 
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
              labelFormatter={(sector) => `Sector: ${sector}`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SectorDistribution;
