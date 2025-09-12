import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit3, Clock, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function Documents() {
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

  const documentTypesData = [
    { name: 'Quotes', count: 156, percentage: 45, color: '#3B82F6' },
    { name: 'Contracts', count: 98, percentage: 28, color: '#10B981' },
    { name: 'Invoices', count: 62, percentage: 18, color: '#F59E0B' },
    { name: 'Proposals', count: 31, percentage: 9, color: '#EF4444' }
  ];

  const editingData = [
    { type: 'Quote', avgEdits: 3.2, completionTime: '2.1 hours' },
    { type: 'Contract', avgEdits: 4.5, completionTime: '3.8 hours' },
    { type: 'Invoice', avgEdits: 1.8, completionTime: '1.2 hours' },
    { type: 'Proposal', avgEdits: 5.2, completionTime: '4.5 hours' }
  ];

  const timeToCompleteData = [
    { registrationDay: 'Day 1', documents: 45 },
    { registrationDay: 'Day 2', documents: 32 },
    { registrationDay: 'Day 3', documents: 28 },
    { registrationDay: 'Day 4', documents: 18 },
    { registrationDay: 'Day 5', documents: 15 },
    { registrationDay: 'Day 6', documents: 12 },
    { registrationDay: 'Day 7+', documents: 8 }
  ];

  const statusData = [
    { status: 'Completed', count: 234, color: '#10B981' },
    { status: 'In Progress', count: 45, color: '#F59E0B' },
    { status: 'Draft', count: 23, color: '#6B7280' },
    { status: 'Review', count: 12, color: '#8B5CF6' }
  ];

  if (!authToken) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Analytics</h1>
          <p className="text-gray-600 mt-1">Analyze document creation patterns and editing behavior</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">347</p>
                <p className="text-sm text-green-600 mt-1">+12% this week</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Edits</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">3.2</p>
                <p className="text-sm text-blue-600 mt-1">per document</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">2.4h</p>
                <p className="text-sm text-purple-600 mt-1">time to finish</p>
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
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">87%</p>
                <p className="text-sm text-orange-600 mt-1">documents finished</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Document Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentTypesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                >
                  {documentTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Editing Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Document Editing Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {editingData.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-white font-bold mb-3 ${
                    ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'][index]
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.type}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{item.avgEdits}</p>
                    <p className="text-sm text-gray-600">avg edits</p>
                    <Badge variant="outline" className="text-xs">{item.completionTime}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Onboarding Speed */}
      <Card>
        <CardHeader>
          <CardTitle>Document Creation After Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeToCompleteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="registrationDay" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="documents" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Insight:</strong> 65% of users create their first document within 24 hours of registration. 
              Early engagement is crucial for retention.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
