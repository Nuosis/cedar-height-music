import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables for testing
vi.mock('../config/env.js', () => ({
  ENV: {
    API_BASE_URL: 'http://localhost:3001/api/v1',
    DATA_SOURCE: 'mock',
    UNDER_MAINTENANCE: false,
    BREVO_API_KEY: 'test-key',
    BREVO_FROM: 'test@example.com',
    CLARITY_API_KEY: 'test-clarity-key'
  }
}))

// Mock fetch globally
globalThis.fetch = vi.fn()

// Mock console methods to reduce noise in tests
globalThis.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
})

// Set up fake timers
beforeEach(() => {
  vi.useFakeTimers()
})