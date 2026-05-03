import React from 'react'
import { AlertTriangle, RefreshCw, Mail } from 'lucide-react'
import { Button } from './core.jsx'

/**
 * React Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 * Includes error reporting functionality and retry mechanisms
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo)
  }

  reportError = (error, errorInfo) => {
    try {
      // Create error report
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId
      }

      // Log to console for development
      console.group('🚨 Error Boundary Report')
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Full Report:', errorReport)
      console.groupEnd()

      // In production, you could send this to an error reporting service
      // Example: Sentry, LogRocket, or custom endpoint
      if (process.env.NODE_ENV === 'production') {
        // Example error reporting (uncomment and configure as needed)
        // fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // }).catch(console.error)
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleReload = () => {
    // Reload the page as a last resort
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { fallback: CustomFallback } = this.props

      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            onReload={this.handleReload}
          />
        )
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-icon">
              <AlertTriangle size={48} />
            </div>
            
            <h2 className="error-title">Something went wrong</h2>
            
            <p className="error-description">
              We're sorry, but something unexpected happened. This error has been logged 
              and we'll look into it.
            </p>

            <div className="error-actions">
              <Button
                variant="primary"
                onClick={this.handleRetry}
                className="retry-button"
              >
                <RefreshCw size={16} />
                Try Again
              </Button>
              
              <Button
                variant="secondary"
                onClick={this.handleReload}
                className="reload-button"
              >
                Reload Page
              </Button>
            </div>

            <div className="error-contact">
              <p className="contact-text">
                If this problem persists, please contact us:
              </p>
              <a 
                href="mailto:kaeden@cedarheightsmusicacademy.com?subject=Website Error Report"
                className="contact-link"
              >
                <Mail size={16} />
                kaeden@cedarheightsmusicacademy.com
              </a>
            </div>

            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <div className="error-stack">
                  <h4>Error Message:</h4>
                  <pre>{this.state.error.message}</pre>
                  
                  <h4>Stack Trace:</h4>
                  <pre>{this.state.error.stack}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>Component Stack:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    // No error, render children normally
    return this.props.children
  }
}

/**
 * Higher-order component to wrap components with error boundary
 * @param {React.Component} Component - Component to wrap
 * @param {Object} errorBoundaryProps - Props to pass to ErrorBoundary
 * @returns {React.Component} Wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

/**
 * Hook to manually trigger error boundary (for testing or error simulation)
 * @returns {Function} Function to trigger error
 */
export const useErrorHandler = () => {
  return (error) => {
    throw error
  }
}

export default ErrorBoundary