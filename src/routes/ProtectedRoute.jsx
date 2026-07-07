import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

// Reusable route guard: verifies auth against the app's existing
// localStorage-backed session (App.jsx hydrates authUser from
// localStorage['user']). Unauthenticated access to any wrapped route is
// redirected to the login page, preserving the originally requested
// location so login can send the user back afterwards.
export default function ProtectedRoute({ authUser, authReady, children }) {
  const location = useLocation()

  if (!authReady) return null // prevent first-load flicker / premature mounting
  if (!authUser) return <Navigate to="/useracc" state={{ from: location }} replace />

  return children
}
