export type RequestLog = {
  type: 'request'
  timestamp: string
  route: string
  method: string
  status: number | null
  latency: number
  identifiers: {
    userId?: string
    organization_id?: string
  }
}

export type SearchAILog = {
  type: 'search_ai'
  timestamp: string
  inputText: string
  filters?: unknown
  aiSuccess: boolean
  fallbackApplied: boolean
}

export function logRequest(_event: Omit<RequestLog, 'timestamp'>) {
  // Logging removed
}

export function logSearchAI(_event: Omit<SearchAILog, 'timestamp'>) {
  // Logging removed
}
