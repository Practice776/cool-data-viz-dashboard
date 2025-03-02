
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { CountryData } from '@/services/api';

interface CountryDistributionProps {
  data: CountryData[];
  activeFilter?: string;
}

const CountryDistribution = ({ data, activeFilter }: CountryDistributionProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipContent, setTooltipContent] = useState<{ country: string; count: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 10, right: 30, bottom: 50, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, height])
      .padding(0.2);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(-height))
      .selectAll('line')
      .attr('stroke', '#e0e0e0');
    
    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('font-size', '10px');
    
    // Color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([0, d3.max(data, d => d.count) || 0])
      .range(['#c4b0ff', '#9b87f5']);
    
    // Add bars
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', d => y(d.country) || 0)
      .attr('height', y.bandwidth())
      .attr('fill', d => d.country === activeFilter ? '#7E69AB' : colorScale(d.count))
      .attr('rx', 4)
      .attr('x', 0)
      .attr('width', 0)
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(300).attr('fill', '#7E69AB');
        setTooltipContent({ country: d.country, count: d.count });
        const [x, y] = d3.pointer(event);
        setTooltipPosition({ x: x + margin.left, y: y + margin.top });
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('fill', d.country === activeFilter ? '#7E69AB' : colorScale(d.count));
        setTooltipContent(null);
      })
      .transition()
      .duration(1000)
      .delay((_, i) => i * 100)
      .attr('width', d => x(d.count));
    
    // Animation for bars with dataset changes
    svg.selectAll('rect')
      .data(data)
      .transition()
      .duration(1000)
      .attr('width', d => x(d.count));
    
  }, [data, activeFilter]);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="chart-title">Top Countries by Event Count</h3>
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
            <div className="font-semibold">{tooltipContent.country}</div>
            <div>Count: {tooltipContent.count}</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CountryDistribution;
