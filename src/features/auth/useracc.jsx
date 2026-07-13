import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LeafIcon, ArrowRightIcon, UserPlusIcon } from '../../components/ui/Icons'

const FIXED_CREDENTIALS = { username: 'janardhan', password: 'jana123', name: 'Janardhan' }

function Useracc({ onAuth, onLoginSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    // prefill username if a user is already logged in
    try {
      const u = localStorage.getItem('user')
      if (u) {
        const parsed = JSON.parse(u)
        if (parsed.username) setUsername(parsed.username)
      }
    } catch (e) {}
  }, [])
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : '/home'

  const clearForm = () => {
    setName('')
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirm('')
  }

  // Registration only creates the account — it must not establish a
  // session. The user still has to log in explicitly afterwards.
  const handleRegister = () => {
    if (!username || !password) return setMsg('Please enter username and password')
    if (password !== confirm) return setMsg('Passwords do not match')
    const creds = { username, password, name, email }
    try { localStorage.setItem('auth_credentials', JSON.stringify(creds)) } catch (e) { console.error(e) }
    setUsername(username)
    setPassword('')
    setConfirm('')
    setName('')
    setEmail('')
    setMode('login')
    setMsg('Registration successful — please log in')
  }

  const handleLogin = () => {
    try {
      if (username === FIXED_CREDENTIALS.username && password === FIXED_CREDENTIALS.password) {
        const u = { name: FIXED_CREDENTIALS.name, username: FIXED_CREDENTIALS.username, email: '' }
        localStorage.setItem('user', JSON.stringify(u))
        clearForm()
        if (onAuth) onAuth(u)
        if (onLoginSuccess) onLoginSuccess()
        navigate(redirectTo, { replace: true })
        return
      }
      const raw = localStorage.getItem('auth_credentials')
      if (!raw) return setMsg('No account found. Please register first.')
      const creds = JSON.parse(raw)
      if (creds.username === username && creds.password === password) {
        const u = { name: creds.name || creds.username, username: creds.username, email: creds.email }
        localStorage.setItem('user', JSON.stringify(u))
        clearForm()
        if (onAuth) onAuth(u)
        if (onLoginSuccess) onLoginSuccess()
        navigate(redirectTo, { replace: true })
      } else {
        setMsg('Invalid username or password')
      }
    } catch (e) { console.error(e); setMsg('Login error') }
  }

  return (
    <div className="useracc-wrapper">
      <div className="form-card auth-card">
        <div className="auth-badge"><LeafIcon /></div>
        <h2 className="auth-heading">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Sign in to continue your food journey.' : 'Join Food Delivery — fast, fresh, and only a tap away.'}
        </p>

        <div className="auth-tabs">
          <button type="button" className={`auth-tab ${mode === 'login' ? 'is-active' : ''}`} onClick={() => setMode('login')} disabled={mode === 'login'}>Sign in</button>
          <button type="button" className={`auth-tab ${mode === 'register' ? 'is-active' : ''}`} onClick={() => setMode('register')} disabled={mode === 'register'}>Sign up</button>
        </div>

        {mode === 'register' ? (
          <div className="auth-fields">
            <label className="field-label">Full name</label>
            <input className="field-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name (optional)" />
            <label className="field-label">Username</label>
            <input className="field-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <label className="field-label">Email</label>
            <input className="field-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (optional)" />

            <div className="auth-fields-row">
              <div>
                <label className="field-label">Password</label>
                <input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
              </div>
              <div>
                <label className="field-label">Confirm</label>
                <input className="field-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm password" />
              </div>
            </div>

            <button type="button" className="btn btn--add btn--block auth-submit" onClick={handleRegister}>
              <UserPlusIcon /> Create account
            </button>
          </div>
        ) : (
          <div className="auth-fields">
            <label className="field-label">Username</label>
            <input className="field-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <label className="field-label">Password</label>
            <input className="field-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />

            <button type="button" className="btn btn--add btn--block auth-submit" onClick={handleLogin}>
              <ArrowRightIcon /> Sign in
            </button>
          </div>
        )}

        <p className="auth-footnote">Demo auth — your data stays on this device.</p>
      </div>

      {msg && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setMsg(null)}
        >
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <p style={{ margin: 0 }}>{msg}</p>
            <button className="btn btn--add modal-close-btn" onClick={() => setMsg(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Useracc
