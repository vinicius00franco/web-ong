import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const GlobalLayout: React.FC = () => {
  return (
    <div className="d-flex min-vh-100">
      <div className="d-none d-md-block" style={{ width: 220 }}>
        <Sidebar />
      </div>
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  )
}

export default GlobalLayout
