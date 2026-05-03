import React from 'react'
import { AlertCircle, AlertTriangle, XCircle, RefreshCw, Mail, ExternalLink } from 'lucide-react'
import { Button } from './core.jsx'

/**
 * Error Message Components
 * Provides various error display patterns with retry mechanisms and user guidance
 * Maintains accessibility standards and consistent design
 */

/**
 * Basic error message component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message to display
 * @param {string} props.type - Error type ('error', 'warning', 'info')
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 * @param {boolean} props.dismissible - Whether error can be dismissed
 * @param {Function} props.onDismiss - Dismiss handler
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Error message component
 */
export const ErrorMessage = ({
  message,
  type = 'error',
  size = 'md',
  dismissible = false,
  onDismiss,
  className = '',
  children,
  ...props
}) => {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: AlertCircle
  }

  const Icon = icons[type] || icons.error

  const sizeClasses = {
    sm: 'error-message-sm',
    md: 'error-message-md',
    lg: 'error-message-lg'
  }

  return (
    <div 
      className={`error-message error-${type} ${sizeClasses[size]} ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="error-content">
        <div className="error-icon">
          <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
        </div>
        
        <div className="error-text">
          {message && <p className="error-message-text">{message}</p>}
          {children}
        </div>

        {dismissible && onDismiss && (
          <button
            className="error-dismiss"
            onClick={onDismiss}
            aria-label="Dismiss error"
          >
            <XCircle size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Error message with retry functionality
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry handler
 * @param {string} props.retryText - Retry button text
 * @param {boolean} props.retrying - Whether retry is in progress
 * @returns {JSX.Element} Error with retry component
 */
export const ErrorWithRetry = ({
  message,
  onRetry,
  retryText = 'Try Again',
  retrying = false,
  className = '',
  ...props
}) => {
  return (
    <ErrorMessage 
      message={message}
      className={`error-with-retry ${className}`}
      {...props}
    >
      <div className="error-actions">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          disabled={retrying}
          className="retry-button"
        >
          <RefreshCw size={16} className={retrying ? 'animate-spin' : ''} />
          {retrying ? 'Retrying...' : retryText}
        </Button>
      </div>
    </ErrorMessage>
  )
}

/**
 * Network error component with specific guidance
 * @param {Object} props - Component props
 * @param {Function} props.onRetry - Retry handler
 * @param {boolean} props.retrying - Whether retry is in progress
 * @returns {JSX.Element} Network error component
 */
export const NetworkError = ({
  onRetry,
  retrying = false,
  className = '',
  ...props
}) => {
  return (
    <ErrorMessage 
      message="Unable to connect to our servers"
      className={`network-error ${className}`}
      {...props}
    >
      <p className="error-description">
        Please check your internet connection and try again. If the problem persists, 
        our servers may be temporarily unavailable.
      </p>
      
      <div className="error-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          disabled={retrying}
          className="retry-button"
        >
          <RefreshCw size={16} className={retrying ? 'animate-spin' : ''} />
          {retrying ? 'Retrying...' : 'Try Again'}
        </Button>
      </div>
    </ErrorMessage>
  )
}

/**
 * API error component with detailed error information
 * @param {Object} props - Component props
 * @param {Object} props.error - Error object with details
 * @param {Function} props.onRetry - Retry handler
 * @param {boolean} props.showDetails - Whether to show error details
 * @returns {JSX.Element} API error component
 */
export const APIError = ({
  error,
  onRetry,
  showDetails = false,
  className = '',
  ...props
}) => {
  const getErrorMessage = (error) => {
    if (error?.message) return error.message
    if (error?.status === 404) return 'The requested resource was not found'
    if (error?.status === 403) return 'You do not have permission to access this resource'
    if (error?.status === 401) return 'Authentication required'
    if (error?.status >= 500) return 'Server error occurred'
    return 'An unexpected error occurred'
  }

  const getErrorType = (error) => {
    if (error?.status === 404 || error?.status === 403) return 'warning'
    return 'error'
  }

  return (
    <ErrorMessage 
      message={getErrorMessage(error)}
      type={getErrorType(error)}
      className={`api-error ${className}`}
      {...props}
    >
      {showDetails && error && (
        <details className="error-details">
          <summary>Technical Details</summary>
          <div className="error-technical">
            {error.status && <p><strong>Status:</strong> {error.status}</p>}
            {error.requestId && <p><strong>Request ID:</strong> {error.requestId}</p>}
            {error.timestamp && <p><strong>Time:</strong> {new Date(error.timestamp).toLocaleString()}</p>}
          </div>
        </details>
      )}
      
      <div className="error-actions">
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="retry-button"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        )}
      </div>
    </ErrorMessage>
  )
}

/**
 * Form validation error component
 * @param {Object} props - Component props
 * @param {Array|Object} props.errors - Validation errors
 * @param {string} props.title - Error section title
 * @returns {JSX.Element} Form validation error component
 */
export const FormValidationError = ({
  errors,
  title = 'Please correct the following errors:',
  className = '',
  ...props
}) => {
  const errorArray = Array.isArray(errors) 
    ? errors 
    : Object.values(errors).filter(Boolean)

  if (errorArray.length === 0) return null

  return (
    <ErrorMessage 
      type="warning"
      className={`form-validation-error ${className}`}
      {...props}
    >
      <div className="validation-errors">
        <h4 className="validation-title">{title}</h4>
        <ul className="validation-list">
          {errorArray.map((error, index) => (
            <li key={index} className="validation-item">
              {error}
            </li>
          ))}
        </ul>
      </div>
    </ErrorMessage>
  )
}

/**
 * Contact support error component
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {string} props.supportEmail - Support email address
 * @param {Function} props.onRetry - Retry handler
 * @returns {JSX.Element} Contact support error component
 */
export const ContactSupportError = ({
  message = 'We encountered an unexpected error',
  supportEmail = 'kaeden@cedarheightsmusicacademy.com',
  onRetry,
  className = '',
  ...props
}) => {
  return (
    <ErrorMessage 
      message={message}
      className={`contact-support-error ${className}`}
      {...props}
    >
      <p className="error-description">
        If this problem continues, please contact our support team for assistance.
      </p>
      
      <div className="error-actions">
        {onRetry && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="retry-button"
          >
            <RefreshCw size={16} />
            Try Again
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          as="a"
          href={`mailto:${supportEmail}?subject=Website Error Report`}
          className="contact-button"
        >
          <Mail size={16} />
          Contact Support
        </Button>
      </div>
    </ErrorMessage>
  )
}

/**
 * Page not found error component
 * @param {Object} props - Component props
 * @param {Function} props.onGoHome - Go home handler
 * @param {Function} props.onGoBack - Go back handler
 * @returns {JSX.Element} Page not found component
 */
export const PageNotFoundError = ({
  onGoHome,
  onGoBack,
  className = '',
  ...props
}) => {
  return (
    <div className={`page-not-found-error ${className}`} {...props}>
      <div className="error-content">
        <div className="error-icon">
          <AlertCircle size={48} />
        </div>
        
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="error-actions">
          {onGoHome && (
            <Button
              variant="primary"
              onClick={onGoHome}
              className="home-button"
            >
              Go Home
            </Button>
          )}
          
          {onGoBack && (
            <Button
              variant="secondary"
              onClick={onGoBack}
              className="back-button"
            >
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Inline error component for form fields
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @returns {JSX.Element} Inline error component
 */
export const InlineError = ({
  message,
  className = '',
  ...props
}) => {
  if (!message) return null

  return (
    <span 
      className={`inline-error ${className}`}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <AlertCircle size={14} />
      {message}
    </span>
  )
}

// Default export is the basic ErrorMessage component
export default ErrorMessage