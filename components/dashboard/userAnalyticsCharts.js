import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import analyticsApi from "@/services/analyticsApi";

const ChartCard = ({ title, data, dataKey = "value", isLoading, error }) => (
  <Card className="w-full">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-bold text-gray-900">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : error ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-sm">Unable to load data</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[0, 'auto']}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
);

export default function UserAnalyticsCharts() {
  const [registeredData, setRegisteredData] = useState([]);
  const [payingData, setPayingData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [activeData, setActiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChartsData();
  }, []);

  const loadChartsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Calculate date range (last 7 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      // Fetch all 4 metrics in parallel
      const [registered, paying, newUsers, active] = await Promise.all([
        analyticsApi.getUserGrowth('registered', startDate.toISOString(), endDate.toISOString(), 'day'),
        analyticsApi.getUserGrowth('paying', startDate.toISOString(), endDate.toISOString(), 'day'),
        analyticsApi.getUserGrowth('new', startDate.toISOString(), endDate.toISOString(), 'day'),
        analyticsApi.getUserGrowth('active', startDate.toISOString(), endDate.toISOString(), 'day'),
      ]);

      // Update state with fetched data
      setRegisteredData(registered?.data || []);
      setPayingData(paying?.data || []);
      setNewData(newUsers?.data || []);
      setActiveData(active?.data || []);
    } catch (err) {
      console.warn('Analytics endpoints not yet configured in Xano. Using sample data.');

      // Check if it's a 404 error (endpoints don't exist)
      if (err.message?.includes('404')) {
        setError('Xano endpoints not configured - showing sample data');
      } else {
        setError(err.message || 'Failed to load analytics data');
      }

      // Use fallback sample data on error for development
      const sampleData = [
        { label: "10/18", value: 100 },
        { label: "10/19", value: 150 },
        { label: "10/20", value: 200 },
        { label: "10/21", value: 175 },
        { label: "10/22", value: 225 },
        { label: "10/23", value: 250 },
        { label: "10/24", value: 280 },
      ];
      setRegisteredData(sampleData);
      setPayingData(sampleData);
      setNewData(sampleData);
      setActiveData(sampleData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard
        title="Total Registered Users"
        data={registeredData}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="Total Paying Users"
        data={payingData}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="NEW Users"
        data={newData}
        isLoading={isLoading}
        error={error}
      />
      <ChartCard
        title="ACTIVE Users"
        data={activeData}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
