
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

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
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
        dashboardAPI.getTopicDistribution(),
        dashboardAPI.getYearTrend(),
        dashboardAPI.getCountryDistribution(),
        dashboardAPI.getIntensityDistribution(),
        dashboardAPI.getLikelihoodDistribution(),
        dashboardAPI.getRegionDistribution(),
        dashboardAPI.getRelevanceByTopic(),
        dashboardAPI.getSectorDistribution()
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
      // In a real implementation, you would pass these filters to your API endpoints
      // For now, we'll simulate by just refetching all data
      await fetchAllData();
      toast.success('Filters applied successfully');
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllData]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
    fetchAllData();
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
