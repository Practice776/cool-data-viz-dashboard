
import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI, FilterParams } from '../services/api';
import { toast } from 'sonner';

export function useDataFetching() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    topicDistribution: [],
    yearTrend: [],
    countryDistribution: [],
    intensityDistribution: [],
    likelihoodDistribution: [],
    regionDistribution: [],
    relevanceByTopic: [],
    sectorDistribution: []
  });

  // Function to fetch all dashboard data
  const fetchAllData = useCallback(async (currentFilters: FilterParams = {}) => {
    setIsLoading(true);
    try {
      // Use the API's filterData method to get filtered results
      const filteredData = await dashboardAPI.filterData(currentFilters);
      
      // Now fetch all chart data with the applied filters
      const [
        topicDistribution,
        yearTrend,
        countryDistribution,
        intensityDistribution,
        likelihoodDistribution,
        regionDistribution,
        relevanceByTopic,
        sectorDistribution
      ] = await Promise.all([
        dashboardAPI.getTopicDistribution(currentFilters),
        dashboardAPI.getYearTrend(currentFilters),
        dashboardAPI.getCountryDistribution(currentFilters),
        dashboardAPI.getIntensityDistribution(currentFilters),
        dashboardAPI.getLikelihoodDistribution(currentFilters),
        dashboardAPI.getRegionDistribution(currentFilters),
        dashboardAPI.getRelevanceByTopic(currentFilters),
        dashboardAPI.getSectorDistribution(currentFilters)
      ]);

      setData({
        topicDistribution,
        yearTrend,
        countryDistribution,
        intensityDistribution,
        likelihoodDistribution,
        regionDistribution,
        relevanceByTopic,
        sectorDistribution
      });
      
      console.log('Data fetched with filters:', currentFilters);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters
  const applyFilters = useCallback(async (newFilters: FilterParams) => {
    setFilters(newFilters);
    setIsLoading(true);
    try {
      // Fetch data with the new filters
      await fetchAllData(newFilters);
      
      // Show a toast notification indicating which filters are applied
      const filterNames = Object.entries(newFilters)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
        .join(', ');
        
      if (filterNames) {
        toast.success(`Filters applied: ${filterNames}`);
      } else {
        toast.success('All filters cleared');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    }
  }, [fetchAllData]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
    fetchAllData({});
    toast.success('Filters reset successfully');
  }, [fetchAllData]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    filters,
    isLoading,
    applyFilters,
    resetFilters
  };
}
