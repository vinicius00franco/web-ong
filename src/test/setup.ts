import '@testing-library/jest-dom'
import { beforeEach } from 'vitest'

// Reset localStorage between tests to avoid cross-test leakage
beforeEach(() => {
  localStorage.clear()
})
