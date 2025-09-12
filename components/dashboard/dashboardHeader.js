import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardHeader({ authData }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{authData?.first_name ? `, ${authData.first_name}` : ''}!
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{currentDate}</span>
          <Badge variant="outline" className="ml-2">Live Data</Badge>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
