/**
 * Test script to verify maintenance mode functionality
 * This test verifies that the ComingSoon component renders when VITE_UNDER_MAINTENANCE is true
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../src/App.jsx'

// Mock the ENV configuration
vi.mock('../src/config/env.js', () => ({
  ENV: {
    API_BASE_URL: '',
    DATA_SOURCE: 'mock',
    UNDER_MAINTENANCE: false // Will be overridden in tests
  }
}))

describe('Maintenance Mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the normal app when UNDER_MAINTENANCE is false', async () => {
    // Mock ENV.UNDER_MAINTENANCE as false
    const { ENV } = await import('../src/config/env.js')
    ENV.UNDER_MAINTENANCE = false

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should not show coming soon message
    expect(screen.queryByText(/We're Making Some Improvements/i)).not.toBeInTheDocument()
    
    // Should show normal app content (we can check for main element)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should render ComingSoon component when UNDER_MAINTENANCE is true', async () => {
    // Mock ENV.UNDER_MAINTENANCE as true
    const { ENV } = await import('../src/config/env.js')
    ENV.UNDER_MAINTENANCE = true

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show coming soon message
    expect(screen.getByText(/We're Making Some Improvements/i)).toBeInTheDocument()
    expect(screen.getByText(/Cedar Heights Music Academy/i)).toBeInTheDocument()
    expect(screen.getByText(/Our website is currently undergoing maintenance/i)).toBeInTheDocument()
    
    // Should not show normal app content
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })

  it('should show contact information in maintenance mode', async () => {
    // Mock ENV.UNDER_MAINTENANCE as true
    const { ENV } = await import('../src/config/env.js')
    ENV.UNDER_MAINTENANCE = true

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show contact information
    expect(screen.getByText(/Need to reach us\? Contact us directly:/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /info@cedarheightsmusicacademy.com/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /\(123\) 456-7890/i })).toBeInTheDocument()
  })
})