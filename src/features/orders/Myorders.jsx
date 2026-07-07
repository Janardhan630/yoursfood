import React from 'react'
import { CheckCircleIcon } from '../../components/ui/Icons'

export default function Myorders() {
  return (
    <div className="page-section">
      <div className="page-section__header">
        <h2>My Orders</h2>
      </div>
      <div className="empty-state">
        <CheckCircleIcon />
        <h3>No orders yet</h3>
        <p>My past orders will be displayed here.</p>
      </div>
    </div>
  )
}
