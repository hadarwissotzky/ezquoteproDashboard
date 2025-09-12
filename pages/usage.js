import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, TrendingUp, Sun } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

export default function Usage() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem('ezquote_auth');
    if (!auth) {
      navigate(createPageUrl("Login"));
      return;
    }
    
    try {
      const parsedAuth = JSON.parse(auth);
      setAuthToken(parsedAuth.authToken);
    } catch (err) {
      navigate(createPageUrl("Login"));
    }
  }, [navigate]);

  const hourlyData = [
    { hour: '6 AM', documents: 2, users: 5 },
    { hour: '7 AM', documents: 5, users: 12 },
    { hour: '8 AM', documents: 18, users: 34 },
    { hour: '9 AM', documents: 32, users: 45 },
    { hour: '10 AM', documents: 28, users: 42 },
    { hour: '11 AM', documents: 35, users: 48 },
    { hour: '12 PM', documents: 42, users: 52 },
    { hour: '1 PM', documents: 38, users: 47 },
    { hour: '2 PM', documents: 45, users: 58 }, // Peak
    { hour: '3 PM', documents: 48, users: 61 }, // Peak
    { hour: '4 PM', documents: 44, users: 55 }, // Peak
    { hour: '5 PM', documents: 32, users: 41 },
    { hour: '6 PM', documents: 22, users: 28 },
    { hour: '7 PM', documents: 15, users: 19 },
    { hour: '8 PM', documents: 8, users: 12 }
  ];

  const weeklyData = [
    { day: 'Monday', activity: 85, peak: '2-3 PM' },
    { day: 'Tuesday', activity: 92, peak: '1-2 PM' },
    { day: 'Wednesday', activity: 88, peak: '3-4 PM' },
    { day: 'Thursday', activity: 95, peak: '2-3 PM' },
    { day: 'Friday', activity: 78, peak: '11-12 PM' },
    { day: 'Saturday', activity: 45, peak: '10-11 AM' },
    { day: 'Sunday', activity: 32, peak: '2-3 PM' }
  ];

  const deviceData = [
    { device: 'Desktop', usage: 68, trend: '+5%' },
    { device: 'Mobile', usage: 28, trend: '+12%' },
    { device: 'Tablet', usage: 4, trend: '-2%' }
  ];

  if (!authToken) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage Patterns</h1>
          <p className="text-gray-600 mt-1">Understand when and how users engage with your app</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">2-4 PM</p>
                <p className="text-sm text-blue-600 mt-1">EST Timezone</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Sun className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Busiest Day</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">Thursday</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  95% activity
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">24m</p>
                <p className="text-sm text-purple-600 mt-1">Duration</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Primary Device</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">Desktop</p>
                <p className="text-sm text-orange-600 mt-1">68% usage</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Usage Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Usage Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="documents" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3} 
                  name="Documents Created"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="activity" fill="#10B981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Device Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deviceData.map((device, index) => (
              <div key={index} className="text-center p-6 border rounded-lg">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 ${
                  ['bg-blue-500', 'bg-green-500', 'bg-orange-500'][index]
                }`}>
                  {device.usage}%
                </div>
                <h3 className="text-lg font-semibold mb-2">{device.device}</h3>
                <Badge 
                  variant={device.trend.startsWith('+') ? 'default' : 'secondary'}
                  className={device.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {device.trend} this month
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Time Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Usage Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    day.activity >= 90 ? 'bg-green-500' : 
                    day.activity >= 70 ? 'bg-blue-500' : 
                    day.activity >= 50 ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                    {day.activity}
                  </div>
                  <div>
                    <p className="font-medium">{day.day}</p>
                    <p className="text-sm text-gray-600">Peak: {day.peak}</p>
                  </div>
                </div>
                <Badge variant="outline">
                  {day.activity >= 90 ? 'High' : 
                   day.activity >= 70 ? 'Medium' : 
                   day.activity >= 50 ? 'Low' : 'Very Low'} Activity
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
