/**
 * API Smoke Tests
 * Tests all public API endpoints to ensure they are accessible and return valid responses.
 * These tests validate the basic functionality of each endpoint without complex scenarios.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { api } from '../../src/services/apiClient.js'

describe('API Smoke Tests', () => {
  beforeAll(() => {
    // Note: These tests will use the current VITE_DATA_SOURCE environment setting
    // Cannot modify import.meta.env at runtime in Vite
  })

  afterAll(() => {
    // Environment variables cannot be modified at runtime in Vite
    // Tests will use whatever VITE_DATA_SOURCE is set to
  })

  describe('Teachers Endpoint', () => {
    it('should return teachers data', async () => {
      const response = await api.getTeachers()
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.metadata).toBeDefined()
      expect(typeof response.metadata.execution_time_ms).toBe('number')
    }, 15000) // 15 second timeout for API calls

    it('should handle teachers filters', async () => {
      const response = await api.getTeachers({ active: true })
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(Array.isArray(response.data)).toBe(true)
    }, 15000)

    it('should validate teacher data structure', async () => {
      const response = await api.getTeachers({ limit: 1 })
      
      if (response.data.length > 0) {
        const teacher = response.data[0]
        expect(teacher).toHaveProperty('id')
        expect(teacher).toHaveProperty('name')
        expect(typeof teacher.id).toBe('number')
        expect(typeof teacher.name).toBe('string')
        
        if (teacher.bio) {
          expect(typeof teacher.bio).toBe('string')
        }
        
        if (teacher.instruments) {
          expect(Array.isArray(teacher.instruments)).toBe(true)
        }
        
        if (teacher.availability_summary) {
          expect(typeof teacher.availability_summary).toBe('object')
          expect(typeof teacher.availability_summary.total_slots).toBe('number')
          expect(typeof teacher.availability_summary.available_slots).toBe('number')
        }
      }
    }, 15000)
  })

  describe('Timeslots Endpoint', () => {
    it('should return timeslots data', async () => {
      const response = await api.getTimeslots()
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.metadata).toBeDefined()
      expect(typeof response.metadata.execution_time_ms).toBe('number')
    }, 15000)

    it('should handle timeslots filters', async () => {
      const response = await api.getTimeslots({ limit: 10 })
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.data.length).toBeLessThanOrEqual(10)
    }, 15000)

    it('should validate timeslot data structure', async () => {
      const response = await api.getTimeslots({ limit: 1 })
      
      if (response.data.length > 0) {
        const timeslot = response.data[0]
        expect(timeslot).toHaveProperty('id')
        expect(timeslot).toHaveProperty('teacher_id')
        expect(timeslot).toHaveProperty('weekday')
        expect(timeslot).toHaveProperty('start_time')
        expect(timeslot).toHaveProperty('end_time')
        expect(timeslot).toHaveProperty('duration')
        
        expect(typeof timeslot.id).toBe('number')
        expect(typeof timeslot.teacher_id).toBe('number')
        expect(typeof timeslot.weekday).toBe('number')
        expect(typeof timeslot.start_time).toBe('string')
        expect(typeof timeslot.end_time).toBe('string')
        expect(typeof timeslot.duration).toBe('number')
        
        // Validate weekday range (0-6)
        expect(timeslot.weekday).toBeGreaterThanOrEqual(0)
        expect(timeslot.weekday).toBeLessThanOrEqual(6)
        
        // Validate duration is positive
        expect(timeslot.duration).toBeGreaterThan(0)
        
        if (timeslot.next_available_date) {
          expect(typeof timeslot.next_available_date).toBe('string')
          // Should be a valid date string
          expect(new Date(timeslot.next_available_date).toString()).not.toBe('Invalid Date')
        }
      }
    }, 15000)

    it('should handle weekday filter validation', async () => {
      // Test valid weekday
      const validResponse = await api.getTimeslots({ weekday: 1 })
      expect(validResponse.success).toBe(true)
      
      // Test invalid weekday should throw error
      await expect(api.getTimeslots({ weekday: 7 })).rejects.toThrow()
      await expect(api.getTimeslots({ weekday: -1 })).rejects.toThrow()
    }, 15000)

    it('should handle limit validation', async () => {
      // Test valid limit
      const validResponse = await api.getTimeslots({ limit: 50 })
      expect(validResponse.success).toBe(true)
      
      // Test invalid limits should throw error
      await expect(api.getTimeslots({ limit: 101 })).rejects.toThrow()
      await expect(api.getTimeslots({ limit: 0 })).rejects.toThrow()
    }, 15000)
  })

  describe('Pricing Endpoint', () => {
    it('should return pricing data', async () => {
      const response = await api.getPricing()
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(typeof response.data).toBe('object')
      expect(response.metadata).toBeDefined()
      expect(typeof response.metadata.execution_time_ms).toBe('number')
    }, 15000)

    it('should validate pricing data structure', async () => {
      const response = await api.getPricing()
      const pricing = response.data
      
      expect(pricing).toHaveProperty('base_monthly_price')
      expect(pricing).toHaveProperty('currency')
      expect(typeof pricing.base_monthly_price).toBe('number')
      expect(typeof pricing.currency).toBe('string')
      expect(pricing.currency).toBe('CAD')
      
      if (pricing.current_semester) {
        expect(typeof pricing.current_semester).toBe('object')
        expect(pricing.current_semester).toHaveProperty('id')
        expect(pricing.current_semester).toHaveProperty('name')
        expect(pricing.current_semester).toHaveProperty('start_date')
        expect(pricing.current_semester).toHaveProperty('end_date')
        
        expect(typeof pricing.current_semester.id).toBe('number')
        expect(typeof pricing.current_semester.name).toBe('string')
        expect(typeof pricing.current_semester.start_date).toBe('string')
        expect(typeof pricing.current_semester.end_date).toBe('string')
        
        // Validate dates
        expect(new Date(pricing.current_semester.start_date).toString()).not.toBe('Invalid Date')
        expect(new Date(pricing.current_semester.end_date).toString()).not.toBe('Invalid Date')
      }
    }, 15000)

    it('should handle billing frequency filter', async () => {
      const monthlyResponse = await api.getPricing({ billing_frequency: 'monthly' })
      expect(monthlyResponse.success).toBe(true)
      
      const yearlyResponse = await api.getPricing({ billing_frequency: 'yearly' })
      expect(yearlyResponse.success).toBe(true)
      
      const semesterResponse = await api.getPricing({ billing_frequency: 'semester' })
      expect(semesterResponse.success).toBe(true)
    }, 15000)

    it('should validate billing frequency', async () => {
      // Invalid billing frequency should throw error
      await expect(api.getPricing({ billing_frequency: 'invalid' })).rejects.toThrow()
    }, 15000)
  })

  describe('Instruments Endpoint', () => {
    it('should return instruments data', async () => {
      const response = await api.getInstruments()
      
      expect(response).toBeDefined()
      expect(response.success).toBe(true)
      expect(Array.isArray(response.data)).toBe(true)
      expect(response.metadata).toBeDefined()
      expect(typeof response.metadata.execution_time_ms).toBe('number')
    }, 15000)

    it('should validate instrument data structure', async () => {
      const response = await api.getInstruments()
      
      if (response.data.length > 0) {
        const instrument = response.data[0]
        expect(instrument).toHaveProperty('id')
        expect(instrument).toHaveProperty('name')
        expect(instrument).toHaveProperty('display_name')
        expect(instrument).toHaveProperty('sort_order')
        
        expect(typeof instrument.id).toBe('number')
        expect(typeof instrument.name).toBe('string')
        expect(typeof instrument.display_name).toBe('string')
        expect(typeof instrument.sort_order).toBe('number')
        
        // Sort order should be positive
        expect(instrument.sort_order).toBeGreaterThan(0)
      }
    }, 15000)

    it('should return instruments in sort order', async () => {
      const response = await api.getInstruments()
      
      if (response.data.length > 1) {
        // Check that instruments are sorted by sort_order
        for (let i = 1; i < response.data.length; i++) {
          expect(response.data[i].sort_order).toBeGreaterThanOrEqual(
            response.data[i - 1].sort_order
          )
        }
      }
    }, 15000)

    it('should handle active filter', async () => {
      const activeResponse = await api.getInstruments({ active: true })
      expect(activeResponse.success).toBe(true)
      
      const allResponse = await api.getInstruments({ active: false })
      expect(allResponse.success).toBe(true)
    }, 15000)
  })

  describe('API Response Standards', () => {
    it('should include consistent metadata in all responses', async () => {
      const endpoints = [
        () => api.getTeachers({ limit: 1 }),
        () => api.getTimeslots({ limit: 1 }),
        () => api.getPricing(),
        () => api.getInstruments({ limit: 1 })
      ]
      
      for (const endpoint of endpoints) {
        const response = await endpoint()
        
        expect(response.metadata).toBeDefined()
        expect(typeof response.metadata.execution_time_ms).toBe('number')
        expect(response.metadata.execution_time_ms).toBeGreaterThan(0)
        
        if (response.metadata.request_id) {
          expect(typeof response.metadata.request_id).toBe('string')
        }
        
        if (response.metadata.timestamp) {
          expect(typeof response.metadata.timestamp).toBe('string')
          expect(new Date(response.metadata.timestamp).toString()).not.toBe('Invalid Date')
        }
      }
    }, 30000)

    it('should handle rate limiting gracefully', async () => {
      // Make multiple rapid requests to test rate limiting
      const requests = Array(5).fill().map(() => api.getInstruments())
      
      const responses = await Promise.all(requests)
      
      // All requests should succeed (rate limiting should be handled internally)
      responses.forEach(response => {
        expect(response.success).toBe(true)
      })
    }, 30000)

    it('should return consistent error format for invalid requests', async () => {
      try {
        await api.getTimeslots({ limit: 999 }) // Invalid limit
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBeDefined()
        expect(typeof error.message).toBe('string')
      }
    }, 15000)
  })

  describe('Performance Benchmarks', () => {
    it('should respond within acceptable time limits', async () => {
      const startTime = Date.now()
      await api.getTeachers({ limit: 10 })
      const endTime = Date.now()
      
      const responseTime = endTime - startTime
      // API should respond within 5 seconds
      expect(responseTime).toBeLessThan(5000)
    }, 15000)

    it('should handle concurrent requests efficiently', async () => {
      const startTime = Date.now()
      
      const requests = [
        api.getTeachers({ limit: 5 }),
        api.getTimeslots({ limit: 5 }),
        api.getPricing(),
        api.getInstruments()
      ]
      
      const responses = await Promise.all(requests)
      const endTime = Date.now()
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.success).toBe(true)
      })
      
      // Concurrent requests should complete within 10 seconds
      const totalTime = endTime - startTime
      expect(totalTime).toBeLessThan(10000)
    }, 20000)
  })

  describe('Data Consistency', () => {
    it('should maintain referential integrity between teachers and timeslots', async () => {
      const teachersResponse = await api.getTeachers()
      const timeslotsResponse = await api.getTimeslots({ limit: 50 })
      
      if (teachersResponse.data.length > 0 && timeslotsResponse.data.length > 0) {
        const teacherIds = new Set(teachersResponse.data.map(t => t.id))
        
        // All timeslot teacher_ids should reference existing teachers
        timeslotsResponse.data.forEach(timeslot => {
          expect(teacherIds.has(timeslot.teacher_id)).toBe(true)
        })
      }
    }, 20000)

    it('should return stable data across multiple requests', async () => {
      const response1 = await api.getInstruments()
      const response2 = await api.getInstruments()
      
      // Data should be consistent between requests
      expect(response1.data.length).toBe(response2.data.length)
      
      if (response1.data.length > 0) {
        expect(response1.data[0].id).toBe(response2.data[0].id)
        expect(response1.data[0].name).toBe(response2.data[0].name)
      }
    }, 20000)
  })
})