
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { SectorData } from '@/services/api';

interface SectorDistributionProps {
  data: SectorData[];
  activeFilter?: string;
}

const SectorDistribution = ({ data, activeFilter }: SectorDistributionProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 50, right: 80, bottom: 50, left: 80 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Scales
    const maxValue = d3.max(data, d => d.value) || 0;
    
    // Features
    const features = data.map(d => d.name);
    
    // Calculate angles for each feature
    const angleSlice = Math.PI * 2 / features.length;
    
    // Radius scale
    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, height / 2]);
    
    // Wrapper for the grid & axes
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');
    
    // Draw the background circles
    axisGrid.selectAll('.levels')
      .data(d3.range(1, 6).reverse())
      .enter()
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (d, i) => height / 2 / 5 * d)
      .style('fill', '#f0f0f0')
      .style('stroke', '#e0e0e0')
      .style('fill-opacity', 0.3);
    
    // Create the axis lines
    axisGrid.selectAll('.axis')
      .data(features)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', '#e0e0e0')
      .style('stroke-width', '1px');
    
    // Append the labels
    axisGrid.selectAll('.axisLabel')
      .data(features)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => rScale(maxValue * 1.25) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(maxValue * 1.25) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('text-anchor', (d, i) => {
        if (i === 0 || i === features.length / 2) return 'middle';
        return i < features.length / 2 ? 'start' : 'end';
      })
      .attr('dy', '0.35em')
      .style('font-size', '10px')
      .attr('fill', '#666')
      .text(d => d);
    
    // Draw radar chart
    const radarLine = d3.lineRadial<SectorData>()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice);
    
    // Create a wrapper for the blobs
    const blobWrapper = svg.append('g')
      .attr('class', 'radarWrapper');
    
    // Create path
    const radarPath = blobWrapper.append('path')
      .datum(data)
      .attr('class', 'radarArea')
      .attr('d', radarLine as any)
      .style('fill', '#9b87f5')
      .style('fill-opacity', 0.6)
      .style('stroke', '#9b87f5')
      .style('stroke-width', 2)
      .style('filter', 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))');
    
    // Draw radar chart points
    const radarCircles = blobWrapper.selectAll('.radarCircle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 6)
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', d => d.name === activeFilter ? '#7E69AB' : '#9b87f5')
      .style('fill-opacity', 0.8)
      .style('stroke', '#fff')
      .style('stroke-width', 2)
      .style('pointer-events', 'all')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 9)
          .style('fill', '#7E69AB');
        
        setTooltipContent({ name: d.name, value: d.value });
        const [x, y] = d3.pointer(event);
        setTooltipPosition({ 
          x: x + margin.left, 
          y: y + margin.top 
        });
      })
      .on('mouseout', function(d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 6)
          .style('fill', d.name === activeFilter ? '#7E69AB' : '#9b87f5');
        
        setTooltipContent(null);
      });
    
    // Animation
    const pathLength = radarPath.node()?.getTotalLength() || 0;
    radarPath
      .attr('stroke-dasharray', pathLength + ' ' + pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);
    
    radarCircles
      .attr('opacity', 0)
      .transition()
      .delay(1500)
      .duration(500)
      .attr('opacity', 1);
      
  }, [data, activeFilter]);

  return (
    <motion.div 
      className="dashboard-chart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h3 className="chart-title">Sector Distribution</h3>
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

export default SectorDistribution;
