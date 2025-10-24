import React, { useState, useEffect } from "react";
import DashboardHeader from "../components/dashboard/dashboardHeader";
import MetricsOverview from "../components/dashboard/metricsOverview";
import RecentActivity from "../components/dashboard/recentActivity";
import QuickInsights from "../components/dashboard/quickInsights";
import UserAnalyticsCharts from "../components/dashboard/userAnalyticsCharts";

export default function Dashboard() {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    // Get auth data from localStorage
    const storedAuth = localStorage.getItem('ezquote_auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthData(parsedAuth);
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <DashboardHeader authData={authData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MetricsOverview authToken={authData?.authToken} />
          <UserAnalyticsCharts />
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <QuickInsights />
        </div>
      </div>
    </div>
  );
}