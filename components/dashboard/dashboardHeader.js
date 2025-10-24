import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import analyticsApi from "@/services/analyticsApi";
import { exportToCSV, formatUserInfoForExport } from "@/utils/exportUtils";

export default function DashboardHeader({ authData }) {
  const [isExporting, setIsExporting] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleExportReport = async () => {
    try {
      setIsExporting(true);

      // Fetch user info data from Xano API
      // Try the query endpoint first, fallback to direct endpoint
      let response;
      try {
        response = await analyticsApi.getUserInfo();
      } catch (err) {
        console.log('Trying alternative endpoint path...');
        response = await analyticsApi.getUserInfoDirect();
      }

      // Format the data for export
      const formattedData = formatUserInfoForExport(response);

      if (formattedData.length === 0) {
        alert('No data available to export. The API returned empty results.');
        return;
      }

      // Export to CSV
      exportToCSV(formattedData, 'user_info_report');

      // Success notification
      alert(`Successfully exported ${formattedData.length} records to CSV!`);

    } catch (error) {
      console.error('Error exporting report:', error);

      // More detailed error message
      let errorMsg = 'Failed to export report. ';
      if (error.message.includes('404')) {
        errorMsg += 'The endpoint /query/user_info_xqwad was not found. Please verify the endpoint exists in Xano.';
      } else if (error.message.includes('401')) {
        errorMsg += 'Authentication failed. Please log in again.';
      } else {
        errorMsg += `Error: ${error.message}`;
      }

      alert(errorMsg);
    } finally {
      setIsExporting(false);
    }
  };

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
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExportReport}
          disabled={isExporting}
        >
          <Download className="w-4 h-4" />
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
