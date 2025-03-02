
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { RegionData } from '@/services/api';

interface RegionDistributionProps {
  data: RegionData[];
  activeFilter?: string;
}

const RegionDistribution = ({ data, activeFilter }: RegionDistributionProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Take only top regions for cleaner visualization
  const topData = data.slice(0, 7);

  useEffect(() => {
    if (!svgRef.current || !topData.length) return;

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
      .range(['#9b87f5', '#1EAEDB', '#F97316', '#7E69AB', '#2F4858', '#7F8EAD', '#E1E7F5']);
    
    // Pie layout
    const pie = d3.pie<RegionData>()
      .value(d => d.value)
      .sort(null);
    
    // Arc generator
    const arc = d3.arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);
    
    // Label arc
    const labelArc = d3.arc<d3.PieArcDatum<RegionData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8);
    
    // Animation arc
    const arcTween = function(d: d3.PieArcDatum<RegionData>) {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function(t: number) {
        return arc(interpolate(t)) as string;
      };
    };

    // Format data for pie chart
    const pieData = pie(topData);
    
    // Add slices
    const path = svg.selectAll('path')
      .data(pieData)
      .enter()
      .append('path')
      .attr('d', d => arc(d) as string)
      .attr('fill', (d) => {
        // Highlight active filter
        if (activeFilter && d.data.name === activeFilter) {
          return d3.color(color(d.data.name))?.darker(0.5) as string;
        }
        return color(d.data.name) as string;
      })
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
    
    // Add labels
    const text = svg.selectAll('text')
      .data(pieData)
      .enter()
      .append('text')
      .attr('transform', d => {
        const pos = labelArc.centroid(d);
        const midAngle = Math.atan2(pos[1], pos[0]);
        const radius = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
        const x = Math.cos(midAngle) * (radius + 20);
        const y = Math.sin(midAngle) * (radius + 20);
        return `translate(${x}, ${y})`;
      })
      .attr('dy', '.35em')
      .style('text-anchor', d => {
        const pos = labelArc.centroid(d);
        return pos[0] < 0 ? 'end' : 'start';
      })
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('opacity', 0)
      .text(d => d.data.name.length > 10 ? `${d.data.name.substring(0, 10)}...` : d.data.name)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);
    
    // Add connecting lines
    svg.selectAll('polyline')
      .data(pieData)
      .enter()
      .append('polyline')
      .attr('stroke', '#ccc')
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .attr('opacity', 0)
      .attr('points', d => {
        const pos = labelArc.centroid(d);
        const midAngle = Math.atan2(pos[1], pos[0]);
        const radius = Math.sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
        const x = Math.cos(midAngle) * (radius + 15);
        const y = Math.sin(midAngle) * (radius + 15);
        return [arc.centroid(d), labelArc.centroid(d), [x, y]].toString();
      })
      .transition()
      .delay(1000)
      .duration(500)
      .attr('opacity', 0.5);
      
  }, [topData, activeFilter]);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="chart-title">Region Distribution</h3>
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

export default RegionDistribution;
