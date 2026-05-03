import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Loading Spinner Component
 * Provides various loading states and spinner animations
 * Matches the existing design system and supports accessibility
 */

/**
 * Basic spinning loader component
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner ('sm', 'md', 'lg', 'xl')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.color - Color variant ('primary', 'secondary', 'white')
 * @returns {JSX.Element} Spinner component
 */
export const Spinner = ({ 
  size = 'md', 
  className = '', 
  color = 'primary',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary', 
    white: 'text-white',
    current: 'text-current'
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      {...props}
    />
  )
}

/**
 * Loading spinner with text
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text to display
 * @param {string} props.size - Size of spinner
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Loading component with text
 */
export const LoadingWithText = ({ 
  text = 'Loading...', 
  size = 'md', 
  className = '',
  ...props 
}) => {
  return (
    <div className={`loading-with-text ${className}`} {...props}>
      <Spinner size={size} />
      <span className="loading-text">{text}</span>
    </div>
  )
}

/**
 * Full page loading overlay
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text
 * @param {boolean} props.backdrop - Show backdrop overlay
 * @returns {JSX.Element} Full page loading component
 */
export const PageLoader = ({ 
  text = 'Loading...', 
  backdrop = true,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`page-loader ${backdrop ? 'with-backdrop' : ''} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={text}
      {...props}
    >
      <div className="page-loader-content">
        <Spinner size="xl" />
        <p className="page-loader-text">{text}</p>
      </div>
    </div>
  )
}

/**
 * Skeleton loading component for content placeholders
 * @param {Object} props - Component props
 * @param {number} props.lines - Number of skeleton lines
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Skeleton loading component
 */
export const SkeletonLoader = ({ 
  lines = 3, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`skeleton-loader ${className}`} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <div 
          key={index}
          className={`skeleton-line ${index === lines - 1 ? 'last-line' : ''}`}
        />
      ))}
    </div>
  )
}

/**
 * Card skeleton for loading cards/tiles
 * @param {Object} props - Component props
 * @param {boolean} props.showAvatar - Show avatar placeholder
 * @param {boolean} props.showImage - Show image placeholder
 * @param {number} props.textLines - Number of text lines
 * @returns {JSX.Element} Card skeleton component
 */
export const CardSkeleton = ({ 
  showAvatar = false,
  showImage = false,
  textLines = 3,
  className = '',
  ...props 
}) => {
  return (
    <div className={`card-skeleton ${className}`} {...props}>
      {showImage && <div className="skeleton-image" />}
      
      <div className="skeleton-content">
        {showAvatar && (
          <div className="skeleton-header">
            <div className="skeleton-avatar" />
            <div className="skeleton-header-text">
              <div className="skeleton-line short" />
              <div className="skeleton-line shorter" />
            </div>
          </div>
        )}
        
        <div className="skeleton-body">
          {Array.from({ length: textLines }, (_, index) => (
            <div 
              key={index}
              className={`skeleton-line ${
                index === textLines - 1 ? 'last-line' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Button loading state
 * @param {Object} props - Component props
 * @param {boolean} props.loading - Whether button is in loading state
 * @param {string} props.loadingText - Text to show when loading
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element} Button with loading state
 */
export const LoadingButton = ({ 
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`loading-button ${loading ? 'is-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" className="button-spinner" />}
      <span className={loading ? 'loading-text' : ''}>
        {loading ? loadingText : children}
      </span>
    </button>
  )
}

/**
 * Progressive loading component
 * Shows different content based on loading progress
 * @param {Object} props - Component props
 * @param {number} props.progress - Loading progress (0-100)
 * @param {string} props.text - Loading text
 * @returns {JSX.Element} Progressive loading component
 */
export const ProgressiveLoader = ({ 
  progress = 0,
  text = 'Loading...',
  className = '',
  ...props 
}) => {
  return (
    <div className={`progressive-loader ${className}`} {...props}>
      <div className="progress-spinner">
        <Spinner size="lg" />
      </div>
      
      <div className="progress-info">
        <p className="progress-text">{text}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

/**
 * Inline loading component for small spaces
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text
 * @returns {JSX.Element} Inline loading component
 */
export const InlineLoader = ({ 
  text = 'Loading...',
  className = '',
  ...props 
}) => {
  return (
    <span className={`inline-loader ${className}`} {...props}>
      <Spinner size="sm" />
      {text && <span className="inline-text">{text}</span>}
    </span>
  )
}

// Default export is the basic LoadingWithText component
const LoadingSpinner = LoadingWithText

export default LoadingSpinner