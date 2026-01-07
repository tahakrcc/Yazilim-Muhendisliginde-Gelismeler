import { authService, User } from '../../services/auth'
import './Header.css'

interface HeaderProps {
  user: User | null
  onLoginClick: () => void
  onAdminClick: () => void
}

export default function Header({ user, onLoginClick, onAdminClick }: HeaderProps) {

  const handleLogout = () => {
    authService.logout()
    window.location.reload() // Simple way to refresh app state
  }

  return (
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
              {user.role === 'ADMIN' && (
                <button onClick={onAdminClick} className="admin-btn-header">
                  Admin Paneli
                </button>
              )}
              <button onClick={handleLogout} className="logout-button">
                Çıkış
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="login-button-header">
              Giriş Yap
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

