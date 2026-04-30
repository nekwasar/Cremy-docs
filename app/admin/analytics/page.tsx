'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '../../_components/AdminSidebar';

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [overview, setOverview] = useState<any>({});
  const [funnel, setFunnel] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/analytics?range=${dateRange}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOverview(data.data?.overview || {});
          setFunnel(data.data?.funnel || {});
          setErrors(data.data?.errors || {});
        }
        setLoading(false);
      });
  }, [dateRange]);

  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>Analytics Dashboard</h1>

        <div>
          <button onClick={() => setDateRange('1d')}>Today</button>
          <button onClick={() => setDateRange('7d')}>7 Days</button>
          <button onClick={() => setDateRange('30d')}>30 Days</button>
          <button onClick={() => setDateRange('90d')}>90 Days</button>
        </div>

        {loading ? (
          <p>Loading analytics...</p>
        ) : (
          <div>
            <h2>Overview</h2>
            <div>
              <div>
                <h3>Total Users</h3>
                <p>{overview.totalUsers || 0}</p>
              </div>
              <div>
                <h3>New Users (Period)</h3>
                <p>{overview.newUsers || 0}</p>
              </div>
              <div>
                <h3>Active Users</h3>
                <p>{overview.activeUsers || 0}</p>
              </div>
              <div>
                <h3>Total Revenue</h3>
                <p>${overview.totalRevenue || 0}</p>
              </div>
              <div>
                <h3>Documents Generated</h3>
                <p>{overview.totalDocuments || 0}</p>
              </div>
              <div>
                <h3>Conversions</h3>
                <p>{overview.totalConversions || 0}</p>
              </div>
              <div>
                <h3>Success Rate</h3>
                <p>{overview.successRate || 0}%</p>
              </div>
              <div>
                <h3>Error Rate</h3>
                <p>{overview.errorRate || 0}%</p>
              </div>
            </div>

            <h2>Tool Usage</h2>
            <div>
              <h3>Most Used Tools</h3>
              <ul>
                {(overview.toolUsage || []).map((t: any, i: number) => (
                  <li key={i}>{t._id}: {t.count} uses</li>
                ))}
              </ul>
            </div>

            <h2>Top Formats</h2>
            <div>
              <h3>Most Requested Formats</h3>
              <ul>
                {(overview.formatUsage || []).map((f: any, i: number) => (
                  <li key={i}>{f._id}: {f.count} uses</li>
                ))}
              </ul>
            </div>

            <h2>Conversion Funnel</h2>
            <div>
              <div>
                <p>Landing Page Views: {funnel.landingViews || 0}</p>
              </div>
              <div>
                <p>Signups: {funnel.signups || 0}</p>
              </div>
              <div>
                <p>First Generation: {funnel.firstGen || 0}</p>
              </div>
              <div>
                <p>First Conversion: {funnel.firstConvert || 0}</p>
              </div>
              <div>
                <p>Free → Pro: {funnel.freeToPro || 0}</p>
              </div>
            </div>

            <h2>Cohort Analysis</h2>
            <div>
              <p>Day 1 Retention: {(overview.retention || {}).day1 || 0}%</p>
              <p>Day 7 Retention: {(overview.retention || {}).day7 || 0}%</p>
              <p>Day 30 Retention: {(overview.retention || {}).day30 || 0}%</p>
              <p>Churn Rate: {(overview.retention || {}).churn || 0}%</p>
            </div>

            <h2>Errors</h2>
            <div>
              <p>Total Errors: {errors.total || 0}</p>
              <h3>By Type</h3>
              <ul>
                {(errors.byType || []).map((e: any, i: number) => (
                  <li key={i}>{e._id}: {e.count}</li>
                ))}
              </ul>
            </div>

            <h2>Realtime</h2>
            <div>
              <p>Active Users Now: {overview.realtime || 0}</p>
              <p>Current Sessions: {overview.currentSessions || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}