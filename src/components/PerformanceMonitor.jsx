/**
 * Performance Monitor Component
 * 
 * Provides real-time monitoring and analytics for API performance,
 * caching efficiency, and user experience metrics.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/apiClient.js';

/**
 * Performance monitoring dashboard component
 * Shows real-time API performance metrics, cache statistics, and system health
 */
export function PerformanceMonitor({ 
  refreshInterval = 5000, 
  showDetailed = false,
  onAlert = null 
}) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Performance thresholds for alerts
  const thresholds = {
    errorRate: 0.05, // 5%
    averageResponseTime: 3000, // 3 seconds
    cacheHitRate: 0.7, // 70%
    memoryUsage: 50 // 50MB estimated
  };

  /**
   * Fetches current performance statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      const currentStats = api.getCacheStats();
      const timestamp = Date.now();
      
      setStats(currentStats);
      
      // Add to history (keep last 20 entries)
      setHistory(prev => {
        const newHistory = [...prev, { ...currentStats, timestamp }];
        return newHistory.slice(-20);
      });
      
      // Check for performance alerts
      checkPerformanceAlerts(currentStats);
      
    } catch (error) {
      console.error('Failed to fetch performance stats:', error);
    }
  }, []);

  /**
   * Checks performance metrics against thresholds and generates alerts
   */
  const checkPerformanceAlerts = useCallback((currentStats) => {
    const newAlerts = [];
    
    // Error rate alert
    if (currentStats.errorRate > thresholds.errorRate) {
      newAlerts.push({
        id: `error-rate-${Date.now()}`,
        type: 'error',
        message: `High error rate: ${(currentStats.errorRate * 100).toFixed(1)}%`,
        threshold: `>${(thresholds.errorRate * 100).toFixed(1)}%`,
        value: currentStats.errorRate
      });
    }
    
    // Response time alert
    if (currentStats.averageResponseTime > thresholds.averageResponseTime) {
      newAlerts.push({
        id: `response-time-${Date.now()}`,
        type: 'warning',
        message: `Slow response time: ${currentStats.averageResponseTime}ms`,
        threshold: `>${thresholds.averageResponseTime}ms`,
        value: currentStats.averageResponseTime
      });
    }
    
    // Cache hit rate alert
    if (currentStats.cacheHitRate < thresholds.cacheHitRate) {
      newAlerts.push({
        id: `cache-hit-${Date.now()}`,
        type: 'warning',
        message: `Low cache hit rate: ${(currentStats.cacheHitRate * 100).toFixed(1)}%`,
        threshold: `<${(thresholds.cacheHitRate * 100).toFixed(1)}%`,
        value: currentStats.cacheHitRate
      });
    }
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts].slice(-10)); // Keep last 10 alerts
      
      // Call external alert handler if provided
      if (onAlert) {
        newAlerts.forEach(alert => onAlert(alert));
      }
    }
  }, [onAlert, thresholds]);

  /**
   * Clears all alerts
   */
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  /**
   * Resets all statistics
   */
  const resetStats = useCallback(() => {
    api.resetStats();
    setHistory([]);
    setAlerts([]);
    fetchStats();
  }, [fetchStats]);

  // Set up periodic stats fetching
  useEffect(() => {
    fetchStats(); // Initial fetch
    
    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchStats, refreshInterval]);

  // Keyboard shortcut to toggle visibility (Ctrl+Shift+P)
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          cursor: 'pointer',
          opacity: 0.7,
          transition: 'opacity 0.2s'
        }}
        onClick={() => setIsVisible(true)}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        📊 Performance Monitor (Ctrl+Shift+P)
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3>Performance Monitor</h3>
          <button onClick={() => setIsVisible(false)} style={styles.closeButton}>×</button>
        </div>
        <div style={styles.loading}>Loading performance data...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>Performance Monitor</h3>
        <div style={styles.headerActions}>
          <button onClick={resetStats} style={styles.button}>Reset</button>
          <button onClick={clearAlerts} style={styles.button}>Clear Alerts</button>
          <button onClick={() => setIsVisible(false)} style={styles.closeButton}>×</button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div style={styles.alertsSection}>
          <h4>🚨 Performance Alerts</h4>
          {alerts.slice(-3).map(alert => (
            <div key={alert.id} style={{
              ...styles.alert,
              backgroundColor: alert.type === 'error' ? '#ffebee' : '#fff3e0',
              borderLeft: `4px solid ${alert.type === 'error' ? '#f44336' : '#ff9800'}`
            }}>
              <strong>{alert.message}</strong>
              <small> (Threshold: {alert.threshold})</small>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div style={styles.metricsGrid}>
        <MetricCard
          title="Cache Hit Rate"
          value={`${(stats.cacheHitRate * 100).toFixed(1)}%`}
          status={stats.cacheHitRate >= thresholds.cacheHitRate ? 'good' : 'warning'}
          subtitle={`${stats.cacheHits} hits / ${stats.cacheHits + stats.cacheMisses} requests`}
        />
        
        <MetricCard
          title="Error Rate"
          value={`${(stats.errorRate * 100).toFixed(1)}%`}
          status={stats.errorRate <= thresholds.errorRate ? 'good' : 'error'}
          subtitle={`${stats.errorCount} errors / ${stats.requestCount} requests`}
        />
        
        <MetricCard
          title="Avg Response Time"
          value={`${stats.averageResponseTime}ms`}
          status={stats.averageResponseTime <= thresholds.averageResponseTime ? 'good' : 'warning'}
          subtitle={`${stats.totalRequests} total requests`}
        />
        
        <MetricCard
          title="Cache Size"
          value={stats.cacheSize}
          status="info"
          subtitle={`${stats.backgroundRefreshCount} background refreshes`}
        />
      </div>

      {/* Detailed Stats */}
      {showDetailed && (
        <div style={styles.detailedStats}>
          <h4>Detailed Statistics</h4>
          <div style={styles.statsGrid}>
            <div>
              <strong>Request Deduplication:</strong>
              <br />
              {stats.deduplicatedRequestCount} requests ({(stats.deduplicationRate * 100).toFixed(1)}%)
            </div>
            <div>
              <strong>Background Refresh:</strong>
              <br />
              {stats.backgroundRefreshCount} refreshes ({(stats.backgroundRefreshRate * 100).toFixed(1)}%)
            </div>
            <div>
              <strong>Active Operations:</strong>
              <br />
              {stats.pendingRequestsCount} pending, {stats.refreshInProgressCount} refreshing
            </div>
            <div>
              <strong>Data Source:</strong>
              <br />
              {stats.dataSource} ({stats.baseURL})
            </div>
          </div>
        </div>
      )}

      {/* Performance History Chart (Simple) */}
      {history.length > 1 && (
        <div style={styles.chartSection}>
          <h4>Performance Trend</h4>
          <div style={styles.miniChart}>
            {history.slice(-10).map((entry) => (
              <div
                key={entry.timestamp}
                style={{
                  ...styles.chartBar,
                  height: `${Math.max(5, (entry.cacheHitRate * 100))}%`,
                  backgroundColor: entry.cacheHitRate >= 0.7 ? '#4caf50' : '#ff9800'
                }}
                title={`Cache Hit Rate: ${(entry.cacheHitRate * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div style={styles.chartLabel}>Cache Hit Rate Trend (Last 10 measurements)</div>
        </div>
      )}
    </div>
  );
}

/**
 * Individual metric card component
 */
function MetricCard({ title, value, status, subtitle }) {
  const statusColors = {
    good: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3'
  };

  return (
    <div style={{
      ...styles.metricCard,
      borderLeft: `4px solid ${statusColors[status]}`
    }}>
      <div style={styles.metricTitle}>{title}</div>
      <div style={styles.metricValue}>{value}</div>
      {subtitle && <div style={styles.metricSubtitle}>{subtitle}</div>}
    </div>
  );
}

// Styles
const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    width: '400px',
    maxHeight: '80vh',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 9999,
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'auto'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f8f9fa'
  },
  
  headerActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  
  button: {
    padding: '4px 8px',
    fontSize: '11px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer'
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0 4px'
  },
  
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#666'
  },
  
  alertsSection: {
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #eee'
  },
  
  alert: {
    padding: '8px 12px',
    margin: '4px 0',
    borderRadius: '4px',
    fontSize: '11px'
  },
  
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    padding: '16px'
  },
  
  metricCard: {
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  
  metricTitle: {
    fontSize: '10px',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  
  metricValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  
  metricSubtitle: {
    fontSize: '10px',
    color: '#888'
  },
  
  detailedStats: {
    padding: '16px',
    borderTop: '1px solid #eee'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '8px'
  },
  
  chartSection: {
    padding: '16px',
    borderTop: '1px solid #eee'
  },
  
  miniChart: {
    display: 'flex',
    alignItems: 'end',
    height: '40px',
    gap: '2px',
    marginTop: '8px'
  },
  
  chartBar: {
    flex: 1,
    minHeight: '2px',
    borderRadius: '1px'
  },
  
  chartLabel: {
    fontSize: '10px',
    color: '#666',
    marginTop: '4px',
    textAlign: 'center'
  }
};

export default PerformanceMonitor;