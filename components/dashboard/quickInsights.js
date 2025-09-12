import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import analyticsApi from "@/services/analyticsApi";

export default function QuickInsights({ authToken }) {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    
    try {
      // For now, skip endpoints that don't exist yet
      // Comment these back in as you create each endpoint in Xano
      
      // const [insightsData, peakUsage, geographic] = await Promise.all([
      //   analyticsApi.getInsights(5),
      //   analyticsApi.getPeakUsage('last_7_days'),
      //   analyticsApi.getGeographicDistribution()
      // ]);
      
      // Process and format insights
      const processedInsights = [];
      
      // Temporarily use demo data until endpoints are created
      const peakUsage = null;
      const geographic = null;
      const insightsData = null;
      
      // Peak usage insight
      if (peakUsage?.peak_hour) {
        processedInsights.push({
          title: "Peak Usage Hours",
          value: `${peakUsage.peak_hour}:00 - ${peakUsage.peak_hour + 2}:00`,
          description: `${peakUsage.peak_percentage}% of daily activity`,
          progress: peakUsage.peak_percentage || 0,
          color: "bg-blue-500"
        });
      }
      
      // Geographic insight
      if (geographic?.top_state) {
        processedInsights.push({
          title: "Top Geographic Region",
          value: geographic.top_state.name,
          description: `${geographic.top_state.percentage}% of total users`,
          progress: geographic.top_state.percentage || 0,
          color: "bg-green-500"
        });
      }
      
      // Add AI-generated insights
      if (insightsData?.insights) {
        insightsData.insights.forEach((insight) => {
          processedInsights.push({
            title: insight.title || "Insight",
            value: insight.value || "N/A",
            description: insight.description || "",
            progress: insight.score || 50,
            color: getRandomColor()
          });
        });
      }
      
      setInsights(processedInsights.slice(0, 4)); // Show max 4 insights
    } catch (error) {
      // Show empty state on error
      setInsights([]);
    }
    setIsLoading(false);
  };
  
  const getRandomColor = () => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))
          ) : (
            insights.map((insight, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-lg font-bold text-gray-900">{insight.value}</p>
                    <p className="text-xs text-gray-500">{insight.description}</p>
                  </div>
                </div>
                <Progress value={insight.progress} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Support Tickets</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <Badge variant="outline">2.3 hours</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Customer Satisfaction</span>
              <Badge className="bg-green-100 text-green-800">4.8/5.0</Badge>
            </div>
          </div>
          <Button className="w-full mt-4" variant="outline">
            View Customer Success Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
