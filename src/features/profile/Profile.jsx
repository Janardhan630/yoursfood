import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile({ setAuthUser }) {
  const [selected, setSelected] = useState('Addresses')
  const [addresses, setAddresses] = useState([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [formText, setFormText] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [phone, setPhone] = useState('6304580822')
  const [email, setEmail] = useState('janardhanvennela23@gmail.com')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem('my_addresses')
    console.log('profile: raw my_addresses from localStorage ->', saved)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        console.log('profile: parsed my_addresses ->', parsed)
        setAddresses(parsed)
      } catch (e) {
        console.error('profile: failed to parse my_addresses', e)
        // fall back to empty array so UI shows "No saved addresses."
        setAddresses([])
      }
    } else {
      const initial = [
        {
          id: 1,
          label: 'Saved Address-1',
          text: `C/O Vennela Simhachalam, 28-1-74,\nsanthinagar 5th road, near raju gari kottu,\neluru mandalam, Eluru, West Godavari,\nAndhra Pradesh - 534001`
        }
      ]
      setAddresses(initial)
      localStorage.setItem('my_addresses', JSON.stringify(initial))
    }
  }, [])

  useEffect(() => {
    const prof = localStorage.getItem('profile_info')
    if (prof) {
      try {
        const parsed = JSON.parse(prof)
        if (parsed.phone) setPhone(parsed.phone)
        if (parsed.email) setEmail(parsed.email)
      } catch (e) {}
    }
    try {
      const u = localStorage.getItem('user')
      if (u) setUser(JSON.parse(u))
    } catch (e) {}
  }, [])

  const persist = (next) => {
    setAddresses(next)
    localStorage.setItem('my_addresses', JSON.stringify(next))
  }

  const handleEdit = (i) => {
    setEditingIndex(i)
    setFormText(addresses[i].text)
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setFormText('')
  }

  const handleSave = (i) => {
    const next = addresses.map((a, idx) => (idx === i ? { ...a, text: formText } : a))
    persist(next)
    setEditingIndex(null)
    setFormText('')
  }

  const handleDelete = (i) => {
    if (!window.confirm('Delete this address?')) return
    const next = addresses.filter((_, idx) => idx !== i)
    persist(next)
    if (editingIndex === i) handleCancel()
  }

  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  const handleSaveProfile = () => {
    const prof = { phone, email }
    try { localStorage.setItem('profile_info', JSON.stringify(prof)) } catch (e) {}
    setSidebarOpen(false)
  }

  const renderDetails = () => {
    switch (selected) {
      case 'About Us':
        return (
          <div className='profile-details'>
            <h2>About Us</h2>
            <p>We are a small team building great food-ordering experiences. Contact us at support@example.com.
              We are a simple and user-friendly food delivery platform designed to make ordering food quick and convenient. Our goal is to connect users with their favorite dishes through a smooth and reliable experience. Built with passion and modern web technologies, this project showcases creativity, functionality, and a love for great food.
            </p>
            <div className='social-links'>
              <a href='https://www.instagram.com'>Instagram</a>
              <a href='https://www.facebook.com'>Facebook</a>
              <a href='https://www.twitter.com'>Twitter</a>
              <a href='https://www.whatsapp.com'>Whatsapp</a>
            </div>
          </div>
        )
      case 'Addresses':
            return (
              <div className='profile-details'>
                {addresses.length === 0 && <p>No saved addresses.</p>}
                {addresses.map((addr, i) => (
                  <div key={addr.id} className='address-item'>
                    <h3>{addr.label}</h3>
                    {editingIndex === i ? (
                      <div className='address-form'>
                        <textarea
                          className='address-textarea'
                          value={formText}
                          onChange={(e) => setFormText(e.target.value)}
                        />
                        <div className='address-actions'>
                          <button className='btn btn--add btn--sm' onClick={() => handleSave(i)}>Save</button>
                          <button className='btn btn--outline btn--sm' onClick={handleCancel}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className='address-text' dangerouslySetInnerHTML={{ __html: addr.text.replace(/\n/g, '<br/>') }} />
                        <div className='address-actions'>
                          <button className='btn btn--outline btn--sm' onClick={() => handleEdit(i)}>EDIT</button>
                          <button className='btn btn--danger btn--sm' onClick={() => handleDelete(i)}>DELETE</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )
      case 'Settings':
        return (
          <div className='profile-details'>
            <h2>Settings</h2>
            <div className='settings-list'>
              <a href='#'>Change Password</a>
              <a href='#'>Manage Payment Methods</a>
              <a href='#'>Notification Preferences</a>
              <a href='#'>Privacy Settings</a>
            </div>
          </div>
        )
      case 'Log Out':
        return (
          <div className='profile-details'>
            <h2>Log Out</h2>
            <p>Click log out to end your session.</p>
            <button className='btn btn--danger' onClick={handleLogout}>Log Out</button>
          </div>
        )
      default:
        return <div className='profile-details' />
    }
  }


   const handleLogout = () => {
     try {
       localStorage.removeItem('user')
       localStorage.removeItem('auth_credentials')
     } catch (e) {}
     if (typeof setAuthUser === 'function') setAuthUser(null)
     setUser(null)
     setSelected('Addresses')
     // redirect to account/login page
     navigate('/useracc')
   }


  return (
    <div className='profile-body'>
      <div className='profile-header'>
        <div>
          <h1>{user ? user.name : 'Guest'}</h1>
          <div className='contact-info'>
            <h3>
              <span>{phone}</span>
              <span aria-hidden='true'>•</span>
              <span>{email}</span>
            </h3>
          </div>
        </div>
        <div>
          <button className='btn btn--add edit-profile-button' onClick={openSidebar}>EDIT PROFILE</button>
        </div>
      </div>

      <div className='profile-main'>
        <div className='profile-menu'>
          <button
            className={`profile-menu-button ${selected === 'About Us' ? 'active' : ''}`}
            onClick={() => setSelected('About Us')}
          >
            About Us
          </button>
          <button
            className={`profile-menu-button ${selected === 'Addresses' ? 'active' : ''}`}
            onClick={() => setSelected('Addresses')}
          >
            Addresses
          </button>
          <button
            className={`profile-menu-button ${selected === 'Settings' ? 'active' : ''}`}
            onClick={() => setSelected('Settings')}
          >
            Settings
          </button>
          <button
            className={`profile-menu-button ${selected === 'Log Out' ? 'active' : ''}`}
            onClick={() => setSelected('Log Out')}
          >
            Log Out
          </button>
        </div>

        {renderDetails()}
      </div>
      {/* Sidebar for editing phone/email */}
      <div className={`profile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className='sidebar-header'>
          <h2>Edit Profile</h2>
          <button className='close-sidebar' onClick={closeSidebar}>×</button>
        </div>
        <div className='sidebar-body'>
          <label className='field-label'>Phone</label>
          <input className='field-input' value={phone} onChange={(e) => setPhone(e.target.value)} />
          <label className='field-label'>Email</label>
          <input className='field-input' value={email} onChange={(e) => setEmail(e.target.value)} />
          <div className='sidebar-actions'>
            <button className='btn btn--add' onClick={handleSaveProfile}>Save</button>
            <button className='btn btn--outline' onClick={closeSidebar}>Cancel</button>
          </div>
        </div>
      </div>
      <div className={`overlay ${sidebarOpen ? 'visible' : ''}`} onClick={closeSidebar} />
    </div>
  )
}