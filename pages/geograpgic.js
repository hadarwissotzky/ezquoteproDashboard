import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Geographic() {
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

  const stateData = [
    { name: 'California', users: 45, percentage: 32 },
    { name: 'Texas', users: 32, percentage: 23 },
    { name: 'Florida', users: 28, percentage: 20 },
    { name: 'New York', users: 18, percentage: 13 },
    { name: 'Illinois', users: 12, percentage: 8 },
    { name: 'Georgia', users: 6, percentage: 4 }
  ];

  const regionData = [
    { name: 'West Coast', value: 42, color: '#3B82F6' },
    { name: 'Southwest', value: 28, color: '#10B981' },
    { name: 'Southeast', value: 18, color: '#F59E0B' },
    { name: 'Northeast', value: 12, color: '#EF4444' }
  ];

  const cityData = [
    { city: 'Los Angeles', state: 'CA', users: 23 },
    { city: 'Houston', state: 'TX', users: 18 },
    { city: 'Miami', state: 'FL', users: 15 },
    { city: 'New York', state: 'NY', users: 12 },
    { city: 'Chicago', state: 'IL', users: 10 },
    { city: 'San Diego', state: 'CA', users: 8 }
  ];

  if (!authToken) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geographic Insights</h1>
          <p className="text-gray-600 mt-1">Understand where your users are located</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total States</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">32</p>
              </div>
              <MapPin className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top State</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">California</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  32% of users
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top City</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">Los Angeles</p>
                <p className="text-sm text-blue-600 mt-1">23 users</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">64%</p>
                <p className="text-sm text-purple-600 mt-1">US Market</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution by State</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#3B82F6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      <Card>
        <CardHeader>
          <CardTitle>Top Cities by User Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityData.map((city, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500'][index]
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{city.city}</p>
                    <p className="text-sm text-gray-500">{city.state}</p>
                  </div>
                </div>
                <Badge variant="outline">{city.users} users</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
