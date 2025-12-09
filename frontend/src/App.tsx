import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import SearchPanel from './components/search/SearchPanel'
import MapView from './components/maps/MapView'
import ProductResults from './components/products/ProductResults'
import AdminPanel from './components/admin/AdminPanel'
import { Product, Market } from './types'
import { marketService } from './services/api'
import { authService } from './services/auth'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMarket, setSelectedMarket] = useState<string>('market_1')
  const [, setAiSuggestions] = useState<string[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [user, setUser] = useState(authService.getUser())
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    const loadMarkets = async () => {
      try {
        const marketsData = await marketService.getAll()
        setMarkets(marketsData)
      } catch (error) {
        console.error('Pazarlar yüklenemedi:', error)
      }
    }
    loadMarkets()

    // User değişikliklerini dinle
    const checkUser = () => {
      const currentUser = authService.getUser()
      setUser(currentUser)
    }
    
    // Her 1 saniyede bir kontrol et (basit bir çözüm)
    const interval = setInterval(checkUser, 1000)
    return () => clearInterval(interval)
  }, [])

  const userRole = user?.role || ''

  return (
    <div className="app">
      <Header />
      {userRole === 'ADMIN' && (
        <div className="admin-toggle">
          <button 
            className={showAdminPanel ? 'active' : ''}
            onClick={() => setShowAdminPanel(!showAdminPanel)}
          >
            {showAdminPanel ? '← Kullanıcı Paneline Dön' : '🔧 Admin Paneli'}
          </button>
        </div>
      )}
      
      {showAdminPanel && userRole === 'ADMIN' ? (
        <AdminPanel userRole={userRole} />
      ) : (
        <div className="main-container">
          <div className="left-panel">
            <SearchPanel
              onSearch={(results, suggestions) => {
                setProducts(results)
                setAiSuggestions(suggestions)
              }}
              selectedMarket={selectedMarket}
              onMarketChange={setSelectedMarket}
              markets={markets}
              onMarketsLoaded={setMarkets}
            />
            <ProductResults
              products={products}
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />
          </div>
          <div className="right-panel">
            <MapView
              products={products}
              selectedProduct={selectedProduct}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App

