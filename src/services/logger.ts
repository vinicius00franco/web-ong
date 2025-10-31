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

export function logRequest(event: Omit<RequestLog, 'timestamp'>) {
  const log: RequestLog = { timestamp: new Date().toISOString(), ...event }
  // Structured JSON log to console (can be redirected by log collectors)
  console.log(log)
}

export function logSearchAI(event: Omit<SearchAILog, 'timestamp'>) {
  const log: SearchAILog = { timestamp: new Date().toISOString(), ...event }
  console.log(log)
}
