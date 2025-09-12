import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, FileText, User, Clock, Edit3, CheckCircle, Send } from "lucide-react";
import analyticsApi from "@/services/analyticsApi";

const ActivityItem = ({ icon: Icon, title, description, time, status }) => (
  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="p-2 rounded-full bg-gray-100">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-400">{time}</span>
        {status && (
          <Badge variant={status === 'completed' ? 'default' : 'secondary'} className="text-xs">
            {status}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

export default function RecentActivity({ authToken }) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    setIsLoading(true);
    
    try {
      // Temporarily skip until endpoint is created
      // const data = await analyticsApi.getRecentActivity(20);
      const data = null;
      
      // Transform API data to component format
      const transformedActivities = data?.activities?.map((activity, index) => {
        let icon = FileText;
        let title = activity.action || "Activity";
        let status = "completed";
        
        // Map activity types to icons and titles
        switch (activity.type) {
          case 'company_created':
            icon = Building2;
            title = "New company registered";
            break;
          case 'proposal_created':
            icon = FileText;
            title = "Proposal created";
            status = "draft";
            break;
          case 'proposal_sent':
            icon = Send;
            title = "Proposal sent";
            break;
          case 'proposal_approved':
            icon = CheckCircle;
            title = "Proposal approved";
            break;
          case 'user_login':
            icon = User;
            title = "User login";
            break;
          case 'document_edited':
            icon = Edit3;
            title = "Document edited";
            status = "in_progress";
            break;
          case 'company_updated':
            icon = Building2;
            title = "Company profile updated";
            break;
        }
        
        return {
          id: activity.id || index,
          icon,
          title,
          description: activity.description || activity.entity_name || "",
          time: formatTimeAgo(activity.created_at),
          status: activity.status || status
        };
      }) || [];
      
      setActivities(transformedActivities.slice(0, 10)); // Show max 10 activities
    } catch (error) {
      // Show empty state on error
      setActivities([]);
    }
    setIsLoading(false);
  };
  
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // Difference in seconds
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-40 mb-1" />
                  <Skeleton className="h-3 w-60 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))
          ) : (
            activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                icon={activity.icon}
                title={activity.title}
                description={activity.description}
                time={activity.time}
                status={activity.status}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
