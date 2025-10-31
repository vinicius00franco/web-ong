import axios from 'axios'
import { logRequest } from './logger'

declare module 'axios' {
  // Augment to allow metadata on config
  interface AxiosRequestConfig {
    _startTime?: number
  }
}

let installed = false

export function installAxiosLogger() {
  if (installed) return
  installed = true

  axios.interceptors.request.use((config) => {
    // mark start time for latency computation
    config._startTime = Date.now()
    return config
  })

  axios.interceptors.response.use(
    (response) => {
      try {
        const start = response.config._startTime ?? Date.now()
        const latency = Date.now() - start
        const method = (response.config.method || 'GET').toUpperCase()
        const route = response.config.url || ''
        const status = response.status

        const identifiers: { userId?: string; organization_id?: string } = {}
        try {
          const raw = localStorage.getItem('user')
          if (raw) {
            const u = JSON.parse(raw)
            identifiers.userId = u?.id
            identifiers.organization_id = u?.organization_id
          }
        } catch {}

        logRequest({
          type: 'request',
          route,
          method,
          status,
          latency,
          identifiers,
        })
      } catch {}
      return response
    },
    (error) => {
      try {
        const cfg = error.config || {}
        const start = cfg._startTime ?? Date.now()
        const latency = Date.now() - start
        const method = (cfg.method || 'GET').toUpperCase()
        const route = cfg.url || ''
        const status = error.response?.status ?? null

        const identifiers: { userId?: string; organization_id?: string } = {}
        try {
          const raw = localStorage.getItem('user')
          if (raw) {
            const u = JSON.parse(raw)
            identifiers.userId = u?.id
            identifiers.organization_id = u?.organization_id
          }
        } catch {}

        logRequest({
          type: 'request',
          route,
          method,
          status,
          latency,
          identifiers,
        })
      } catch {}
      return Promise.reject(error)
    }
  )
}

// Auto-install when module is imported
installAxiosLogger()
