
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { TopicData } from '@/services/api';
import { Card } from '@/components/ui/card';

interface TopicDistributionProps {
  data: TopicData[];
}

const TopicDistribution = ({ data }: TopicDistributionProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Take only top 6 topics for cleaner visualization
  const topData = data.slice(0, 6);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const radius = Math.min(width, height) / 2;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
    
    // Color scale
    const color = d3.scaleOrdinal<string>()
      .domain(topData.map(d => d.name))
      .range(['#9b87f5', '#7E69AB', '#1EAEDB', '#2F4858', '#F97316', '#7F8EAD']);
    
    // Pie layout
    const pie = d3.pie<TopicData>()
      .value(d => d.value)
      .sort(null);
    
    // Arc generator
    const arc = d3.arc<d3.PieArcDatum<TopicData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.9)
      .cornerRadius(8)
      .padAngle(0.03);
    
    // Animation arc
    const arcTween = function(d: d3.PieArcDatum<TopicData>) {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function(t: number) {
        return arc(interpolate(t)) as string;
      };
    };
    
    // Add slices
    const path = svg.selectAll('path')
      .data(pie(topData))
      .enter()
      .append('path')
      .attr('d', d => arc(d) as string)
      .attr('fill', d => color(d.data.name) as string)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.9)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('transform', `scale(1.05)`);
        
        setTooltipContent({ name: d.data.name, value: d.data.value });
        const [x, y] = d3.pointer(event);
        setTooltipPosition({ 
          x: x + width / 2, 
          y: y + height / 2 
        });
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('transform', `scale(1)`);
        
        setTooltipContent(null);
      })
      .transition()
      .duration(1000)
      .attrTween('d', arcTween);
    
    // Add topic labels
    svg.selectAll('text')
      .data(pie(topData))
      .enter()
      .append('text')
      .attr('transform', d => {
        const centroid = arc.centroid(d);
        return `translate(${centroid[0] * 1.4}, ${centroid[1] * 1.4})`;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .style('fill', '#555')
      .style('opacity', 0)
      .text(d => d.data.name.length > 10 ? d.data.name.substring(0, 10) + '...' : d.data.name)
      .transition()
      .delay(800)
      .duration(500)
      .style('opacity', 1);
      
    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Topics')
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);
      
    // Total count display
    const totalCount = topData.reduce((sum, item) => sum + item.value, 0);
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', 22)
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(`Total: ${totalCount}`)
      .style('opacity', 0)
      .transition()
      .delay(1200)
      .duration(500)
      .style('opacity', 1);

  }, [data]);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="chart-title">Topic Distribution</h3>
      <div className="flex-1 min-h-[300px] relative">
        <svg ref={svgRef} width="100%" height="100%" />
        
        {tooltipContent && (
          <div 
            className="absolute bg-white p-2 rounded-md shadow-md text-sm border border-gray-200 z-10 pointer-events-none"
            style={{ 
              left: `${tooltipPosition.x}px`, 
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="font-semibold">{tooltipContent.name}</div>
            <div>Count: {tooltipContent.value}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicDistribution;
