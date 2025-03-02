
import { useState, useEffect } from 'react';
import { FilterParams } from '@/services/api';
import { motion } from 'framer-motion';
import { FilterX, SlidersHorizontal, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterPanelProps {
  filters: FilterParams;
  onApplyFilters: (filters: FilterParams) => void;
  onResetFilters: () => void;
}

const FilterPanel = ({ filters, onApplyFilters, onResetFilters }: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<FilterParams>(filters);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof FilterParams, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Include search term in topic filter if provided
    if (searchTerm && searchTerm.trim() !== "") {
      onApplyFilters({...localFilters, topic: searchTerm});
    } else {
      onApplyFilters(localFilters);
    }
  };

  // Sample data for filter options (in a real app, these would come from your API)
  const years = ['2020', '2021', '2022', '2023', '2024'];
  const topics = ['Technology', 'Economy', 'Politics', 'Environment', 'Healthcare', 'Education', 'Oil', 'Energy', 'Gas'];
  const sectors = ['Energy', 'Finance', 'Manufacturing', 'Agriculture', 'Information Technology', 'Healthcare'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa', 'Latin America'];
  const pestles = ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'];
  const sources = ['Source 1', 'Source 2', 'Source 3', 'Source 4', 'Source 5'];
  const swots = ['Strength', 'Weakness', 'Opportunity', 'Threat'];
  const countries = ['United States', 'China', 'Germany', 'India', 'United Kingdom', 'Japan'];

  return (
    <motion.div 
      className="container mx-auto max-w-7xl px-4 md:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="bg-white rounded-xl shadow-subtle p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <SlidersHorizontal className="h-5 w-5 text-dashboard-primary mr-2" />
            <h2 className="text-lg font-semibold">Dashboard Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by topic (e.g., oil)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mr-2 text-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-sm flex items-center"
              onClick={onResetFilters}
            >
              <FilterX className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
        
        {isOpen && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">End Year</label>
              <Select
                value={localFilters.end_year || ''}
                onValueChange={(value) => handleFilterChange('end_year', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Topic</label>
              <Select
                value={localFilters.topic || ''}
                onValueChange={(value) => handleFilterChange('topic', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map(topic => (
                    <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Sector</label>
              <Select
                value={localFilters.sector || ''}
                onValueChange={(value) => handleFilterChange('sector', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Region</label>
              <Select
                value={localFilters.region || ''}
                onValueChange={(value) => handleFilterChange('region', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">PESTLE</label>
              <Select
                value={localFilters.pestle || ''}
                onValueChange={(value) => handleFilterChange('pestle', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select PESTLE" />
                </SelectTrigger>
                <SelectContent>
                  {pestles.map(pestle => (
                    <SelectItem key={pestle} value={pestle}>{pestle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Source</label>
              <Select
                value={localFilters.source || ''}
                onValueChange={(value) => handleFilterChange('source', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">SWOT</label>
              <Select
                value={localFilters.swot || ''}
                onValueChange={(value) => handleFilterChange('swot', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select SWOT" />
                </SelectTrigger>
                <SelectContent>
                  {swots.map(swot => (
                    <SelectItem key={swot} value={swot}>{swot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-dashboard-darkgray">Country</label>
              <Select
                value={localFilters.country || ''}
                onValueChange={(value) => handleFilterChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="mt-4 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button onClick={handleApplyFilters} className="bg-dashboard-primary hover:bg-dashboard-secondary">
            Apply Filters
          </Button>
        </motion.div>
        
        {Object.values(filters).some(f => f) && (
          <motion.div 
            className="mt-2 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-sm text-dashboard-neutral mr-2">Active filters:</div>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <div key={key} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  <span className="capitalize">{key.replace('_', ' ')}:</span> {value}
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterPanel;
