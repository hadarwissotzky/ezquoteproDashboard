
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import analyticsApi from "@/services/analyticsApi";
import { 
  Search, 
  Building2, 
  FileText, 
  MoreHorizontal,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  ArrowUp,
  ArrowDown,
  Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomerSuccess() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    const auth = localStorage.getItem('ezquote_auth');
    if (!auth) {
      navigate(createPageUrl("Dashboard"));
      return;
    }
    
    try {
      const parsedAuth = JSON.parse(auth);
      setAuthToken(parsedAuth.authToken);
      loadCompanies(parsedAuth.authToken);
    } catch (err) {
      navigate(createPageUrl("Dashboard"));
    }
  }, [navigate]);

  const loadCompanies = async (token) => {
    if (!token) return;
    
    setIsLoading(true);
    
    // Skip demo mode check - always try to use real API
    const isDemoMode = false; // Force production mode
    
    if (isDemoMode) {
      // Use demo data
      setTimeout(() => {
        const demoCompanies = [
          {
            id: 1,
            name: "Acme Corporation",
            email: "contact@acme.com",
            phone: "(555) 123-4567",
            website: "www.acme.com",
            address: "123 Business Ave, New York, NY 10001",
            subscription: "Premium",
            documents_created: 145,
            last_activity: "2 hours ago"
          },
          {
            id: 2,
            name: "Global Solutions Inc",
            email: "info@globalsolutions.com",
            phone: "(555) 234-5678",
            website: "www.globalsolutions.com",
            address: "456 Corporate Blvd, Los Angeles, CA 90001",
            subscription: "Enterprise",
            documents_created: 287,
            last_activity: "30 minutes ago"
          },
          {
            id: 3,
            name: "Tech Innovators",
            email: "hello@techinnovators.io",
            phone: "(555) 345-6789",
            website: "www.techinnovators.io",
            address: "789 Innovation Way, San Francisco, CA 94105",
            subscription: "Basic",
            documents_created: 43,
            last_activity: "1 day ago"
          },
          {
            id: 4,
            name: "Smith & Associates",
            email: "admin@smithassoc.com",
            phone: "(555) 456-7890",
            website: "www.smithassoc.com",
            address: "321 Legal Plaza, Chicago, IL 60601",
            subscription: "Premium",
            documents_created: 198,
            last_activity: "5 hours ago"
          },
          {
            id: 5,
            name: "Digital Marketing Pro",
            email: "team@digitalmarketingpro.com",
            phone: "(555) 567-8901",
            website: "www.digitalmarketingpro.com",
            address: "654 Marketing St, Austin, TX 78701",
            subscription: "Premium",
            documents_created: 167,
            last_activity: "3 hours ago"
          }
        ];
        setCompanies(demoCompanies);
        setIsLoading(false);
      }, 500);
      return;
    }
    
    // Real API call for production mode
    try {
      // Fetch detailed company data from API
      const data = await analyticsApi.getCompaniesDetailed(100);
      
      // Transform API data to component format
      const transformedCompanies = data?.companies?.map((company) => ({
        id: company.id,
        name: company.name || "Unknown Company",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        address: `${company.address || ""}, ${company.city || ""}, ${company.state || ""} ${company.zip || ""}`.trim(),
        subscription: company.subscription_tier || "Basic",
        documents_created: company.proposal_count || 0,
        last_activity: formatTimeAgo(company.last_activity),
        users_count: company.user_count || 0,
        engagement_score: company.engagement_score || 0
      })) || [];
      
      setCompanies(transformedCompanies);
    } catch (error) {
      console.error("Error loading companies:", error);
      // Use empty array on error
      setCompanies([]);
    }
    setIsLoading(false);
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Never";
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // Difference in seconds
    
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  const sortedAndFilteredCompanies = useMemo(() => {
    let filtered = [...companies];

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by subscription
    if (subscriptionFilter !== 'all') {
      filtered = filtered.filter(company => {
        const isTrial = company.core_subscriptions_id === 1;
        if (subscriptionFilter === 'trial') return isTrial;
        if (subscriptionFilter === 'paid') return !isTrial;
        return true;
      });
    }

    // Sort
    if (sortConfig.key !== null) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting
        if (sortConfig.key === 'created_at') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [companies, searchTerm, subscriptionFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp className="w-4 h-4 ml-2" />;
    }
    return <ArrowDown className="w-4 h-4 ml-2" />;
  };

  const calculateDaysLeft = (createdAt) => {
    const trialDurationDays = 14;
    const registrationDate = new Date(createdAt);
    const expirationDate = new Date(registrationDate.getTime());
    expirationDate.setDate(registrationDate.getDate() + trialDurationDays);

    const today = new Date();
    const timeLeft = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));
    
    return daysLeft >= 0 ? daysLeft : 'Expired';
  };

  const handleActionClick = (action, company) => {
    switch (action) {
      case 'reset':
        // Implement document reset functionality
        console.log('Reset documents for', company.name);
        break;
      case 'email':
        window.open(`mailto:${company.email}`);
        break;
      case 'view':
        setSelectedCompany(company);
        break;
      default:
        break;
    }
  };

  if (!authToken) {
    return null;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Success</h1>
          <p className="text-gray-600 mt-1">Manage customers and provide support</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => loadCompanies(authToken)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Companies List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Companies ({sortedAndFilteredCompanies.length})
                  </CardTitle>
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search companies or emails..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t pt-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Filter className="w-4 h-4" />
                      Filter by:
                    </div>
                    <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Subscription Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subscriptions</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('name')} className="px-0 py-0 h-auto">
                          Company {getSortIcon('name')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('email')} className="px-0 py-0 h-auto">
                          Email {getSortIcon('email')}
                        </Button>
                      </TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('created_at')} className="px-0 py-0 h-auto">
                          Created {getSortIcon('created_at')}
                        </Button>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6}><div className="h-8 bg-gray-200 rounded animate-pulse w-full"></div></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      sortedAndFilteredCompanies.map((company) => (
                        <TableRow 
                          key={company.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedCompany(company)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="font-medium">{company.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>
                            <Badge variant={company.core_subscriptions_id === 1 ? "secondary" : "default"}>
                              {company.core_subscriptions_id === 1 ? "Trial" : "Paid"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {company.core_subscriptions_id === 1 ? (
                              <span className="font-medium">{calculateDaysLeft(company.created_at)}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(company.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleActionClick('view', company)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleActionClick('email', company)}>
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleActionClick('reset', company)}>
                                  Reset Documents
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {selectedCompany ? 'Company Details' : 'Select a Company'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCompany ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedCompany.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedCompany.email}</span>
                      </div>
                      {selectedCompany.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedCompany.phone}</span>
                        </div>
                      )}
                      {selectedCompany.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span>{selectedCompany.website}</span>
                        </div>
                      )}
                      {selectedCompany.billing_address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{selectedCompany.billing_city}, {selectedCompany.billing_state}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Account Info</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subscription</p>
                        <Badge variant={selectedCompany.core_subscriptions_id === 1 ? "secondary" : "default"}>
                          {selectedCompany.core_subscriptions_id === 1 ? "Trial" : "Paid"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-gray-600">Company ID</p>
                        <p className="font-mono">{selectedCompany.id}</p>
                      </div>
                      {selectedCompany.core_subscriptions_id === 1 && (
                        <div>
                          <p className="text-gray-600">Trial Days Left</p>
                          <p className="font-medium">{calculateDaysLeft(selectedCompany.created_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => window.open(`mailto:${selectedCompany.email}`)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleActionClick('reset', selectedCompany)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset Documents
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a company from the list to view details and manage their account.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

