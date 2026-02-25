'use client'

import { useCallback } from 'react'

/**
 * AWS Auth hook stub for local development.
 * In production, this would integrate with AWS Cognito.
 * For local dev, it delegates to localStorage-based auth.
 */
export const useAWSAuth = () => {
  const logout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ecm_user')
      localStorage.removeItem('dev_user')
    }
  }, [])

  return {
    logout,
  }
}
