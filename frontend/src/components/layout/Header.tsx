import { useState, useEffect } from 'react'
import { authService, User } from '../../services/auth'
import Login from '../auth/Login'
import './Header.css'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    const currentUser = authService.getUser()
    setUser(currentUser)
  }, [])

  const handleLoginSuccess = () => {
    const currentUser = authService.getUser()
    setUser(currentUser)
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🛒 Pazar Yönetim Sistemi</h1>
            <p>Yapay Zeka Destekli Ürün Arama ve 3D Konum Yönlendirme</p>
          </div>
          <div className="header-auth">
            {user ? (
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <span className="user-role">({user.role})</span>
                <button onClick={handleLogout} className="logout-button">
                  Çıkış
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-button-header">
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      </header>
      {showLogin && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  )
}

