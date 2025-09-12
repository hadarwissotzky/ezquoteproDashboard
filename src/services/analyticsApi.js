const API_BASE_URL = 'https://app.ezquotepro.com/api:7P7UmHjg';

class AnalyticsAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Get token directly from localStorage for every request
    const token = localStorage.getItem('ezquote_token') || this.getAuthToken();
    
    // Build headers with auth token
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Always add Authorization header with Bearer token if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge options properly - headers should not be overwritten
    const requestOptions = {
      ...options,
      headers: headers,  // Ensure our headers with auth token are used
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);

      if (!response.ok) {
        // If 401, clear auth and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('ezquote_auth');
          localStorage.removeItem('ezquote_token');
          window.location.href = '/';
          return null;
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  getAuthToken() {
    const auth = localStorage.getItem('ezquote_auth');
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        return parsed.authToken;
      } catch {
        return null;
      }
    }
    return null;
  }

  // Dashboard Metrics
  async getMetricsSummary(startDate, endDate) {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('metrics', JSON.stringify(['companies', 'documents', 'users', 'sessions']));
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return this.request(`/metrics/summary?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getCompaniesMetrics(startDate, endDate, groupBy = 'month') {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('group_by', groupBy);
    
    return this.request(`/metrics/companies?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getProposalsMetrics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('include_status', 'true');
    params.append('group_by', 'status');
    
    return this.request(`/metrics/proposals?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Activity APIs
  async getRecentActivity(limit = 50) {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('include', JSON.stringify(['proposals', 'users', 'companies']));
    params.append('order_by', 'created_at_desc');
    
    return this.request(`/activity/recent?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getSessionAnalytics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    params.append('group_by', 'hour_of_day');
    
    return this.request(`/analytics/sessions?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Geographic Analytics
  async getGeographicDistribution() {
    const params = new URLSearchParams();
    params.append('group_by', 'state');
    params.append('include_metrics', JSON.stringify(['company_count', 'proposal_count', 'revenue']));
    
    return this.request(`/analytics/geographic?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getCityAnalytics(state, limit = 20) {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    params.append('limit', limit.toString());
    params.append('order_by', 'proposal_count_desc');
    
    return this.request(`/analytics/geographic/cities?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Document/Proposal Analytics
  async getProposalStatus(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return this.request(`/analytics/proposals/status?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getProposalPerformance() {
    const params = new URLSearchParams();
    params.append('metrics', JSON.stringify(['approval_rate', 'avg_time_to_approval', 'generation_count']));
    params.append('group_by', 'month');
    
    return this.request(`/analytics/proposals/performance?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getDocumentTypes(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    return this.request(`/analytics/documents/types?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Customer Success
  async getCompaniesDetailed(limit = 100) {
    const params = new URLSearchParams();
    params.append('include', JSON.stringify(['proposal_count', 'user_count', 'last_activity']));
    params.append('limit', limit.toString());
    params.append('order_by', 'last_activity_desc');
    
    return this.request(`/companies/detailed?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getCompanyEngagement(companyIds) {
    const params = new URLSearchParams();
    params.append('company_ids', JSON.stringify(companyIds));
    params.append('metrics', JSON.stringify(['login_frequency', 'proposal_creation_rate', 'approval_rate']));
    
    return this.request(`/analytics/companies/engagement?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Usage Analytics
  async getPeakUsage(period = 'last_30_days') {
    const params = new URLSearchParams();
    params.append('period', period);
    params.append('group_by', 'hour_and_day');
    
    return this.request(`/analytics/usage/peaks?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getFeatureUsage() {
    const params = new URLSearchParams();
    params.append('features', JSON.stringify(['proposal_generation', 'audio_transcription', 'pdf_export']));
    params.append('group_by', 'week');
    
    return this.request(`/analytics/features?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Trends
  async getGrowthTrends() {
    const params = new URLSearchParams();
    params.append('metrics', JSON.stringify(['new_companies', 'new_users', 'proposals_created']));
    params.append('period', 'last_12_months');
    params.append('compare_to', 'previous_period');
    
    return this.request(`/analytics/trends/growth?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getRevenueAnalytics() {
    const params = new URLSearchParams();
    params.append('group_by', 'month');
    params.append('include', JSON.stringify(['approved_proposal_value', 'company_size_breakdown']));
    
    return this.request(`/analytics/revenue?${params.toString()}`, {
      method: 'GET',
    });
  }

  // Quick Insights
  async getInsights(limit = 5) {
    const params = new URLSearchParams();
    params.append('focus_areas', JSON.stringify(['anomalies', 'trends', 'opportunities']));
    params.append('limit', limit.toString());
    
    return this.request(`/insights/generate?${params.toString()}`, {
      method: 'GET',
    });
  }

  async getComparativeAnalytics(currentPeriod, compareTo) {
    const params = new URLSearchParams();
    params.append('current_period', currentPeriod);
    params.append('compare_to', compareTo);
    params.append('metrics', JSON.stringify(['all']));
    
    return this.request(`/analytics/compare?${params.toString()}`, {
      method: 'GET',
    });
  }
}

export default new AnalyticsAPI();