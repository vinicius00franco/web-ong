import '@testing-library/jest-dom'
import { beforeEach, expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

// Reset localStorage between tests to avoid cross-test leakage
beforeEach(() => {
  localStorage.clear()
})

expect.extend(toHaveNoViolations)
