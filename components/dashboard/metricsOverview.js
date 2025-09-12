import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  FileText, 
  Clock, 
  Users, 
  TrendingUp, 
  TrendingDown,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import analyticsApi from "@/services/analyticsApi";

const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function MetricsOverview({ authToken }) {
  const [timeRange, setTimeRange] = useState("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    companies: 0,
    documents: 0,
    unfinished: 0,
    users: 0
  });

  const loadMetrics = useCallback(async () => {
    setIsLoading(true);
    
    // Real API calls
    try {
      let startDate, endDate;
      
      switch (timeRange) {
        case 'daily':
          // Today from 00:00:00 to 23:59:59
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          break;
        case 'weekly':
          // Last 7 days
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 6);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          // Last 30 days
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 29);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          // Default to today
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999);
      }

      // Only fetch metrics summary for now
      const summaryData = await analyticsApi.getMetricsSummary(startDate.toISOString(), endDate.toISOString());
      
      // Calculate metrics from API response
      const processedMetrics = {
        companies: summaryData?.companies || 0,
        documents: summaryData?.documents || 0,
        unfinished: summaryData?.unfinished_documents || summaryData?.unfinished || 0,
        users: summaryData?.users || 0,
        companiesChange: 0,
        documentsChange: 0,
        unfinishedChange: 0,
        usersChange: 0
      };

      // Calculate percentage changes if previous period exists
      if (summaryData?.previous_period) {
        processedMetrics.companiesChange = calculatePercentageChange(
          summaryData.companies,
          summaryData.previous_period.companies
        );
        processedMetrics.documentsChange = calculatePercentageChange(
          summaryData.documents,
          summaryData.previous_period.documents
        );
        processedMetrics.unfinishedChange = calculatePercentageChange(
          summaryData.unfinished_documents || summaryData.unfinished || 0,
          summaryData.previous_period.unfinished_documents || summaryData.previous_period.unfinished || 0
        );
        processedMetrics.usersChange = calculatePercentageChange(
          summaryData.users,
          summaryData.previous_period.users
        );
      }
      
      setMetrics(processedMetrics);
    } catch (error) {
      // Show empty state on error
      setMetrics({
        companies: 0,
        documents: 0,
        unfinished: 0,
        users: 0
      });
    }
    setIsLoading(false);
  }, [timeRange, authToken]);

  const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Key Metrics</CardTitle>
          <Tabs value={timeRange} onValueChange={setTimeRange} className="w-auto">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <MetricCard
                title="Companies Created"
                value={metrics.companies}
                change={metrics.companiesChange ? `${metrics.companiesChange > 0 ? '+' : ''}${metrics.companiesChange}%` : null}
                changeType={metrics.companiesChange >= 0 ? "increase" : "decrease"}
                icon={Building2}
                color="bg-blue-500"
              />
              <MetricCard
                title="Documents Created"
                value={metrics.documents}
                change={metrics.documentsChange ? `${metrics.documentsChange > 0 ? '+' : ''}${metrics.documentsChange}%` : null}
                changeType={metrics.documentsChange >= 0 ? "increase" : "decrease"}
                icon={FileText}
                color="bg-green-500"
              />
              <MetricCard
                title="Unfinished Documents"
                value={metrics.unfinished}
                change={metrics.unfinishedChange ? `${metrics.unfinishedChange > 0 ? '+' : ''}${metrics.unfinishedChange}%` : null}
                changeType={metrics.unfinishedChange >= 0 ? "increase" : "decrease"}
                icon={Clock}
                color="bg-orange-500"
              />
              <MetricCard
                title="Active Users"
                value={metrics.users}
                change={metrics.usersChange ? `${metrics.usersChange > 0 ? '+' : ''}${metrics.usersChange}%` : null}
                changeType={metrics.usersChange >= 0 ? "increase" : "decrease"}
                icon={Users}
                color="bg-purple-500"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
