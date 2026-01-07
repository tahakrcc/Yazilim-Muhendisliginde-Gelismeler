import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import SearchPanel from './components/search/SearchPanel'
import MapView from './components/maps/MapView'
import ProductResults from './components/products/ProductResults'
import AdminPanel from './components/admin/AdminPanel'
import MarketList from './components/market/MarketList'
import Login from './components/auth/Login'
import { Product, Market } from './types'
import { marketService } from './services/api'
import { authService } from './services/auth'
import './App.css'

import ChatBot from './components/chat/ChatBot'

function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'market'>('home')

  // Data State
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [, setAiSuggestions] = useState<string[]>([])
  const [, setMarkets] = useState<Market[]>([]) // Keeping setter for now if needed by loadMarkets, or remove completely if loadMarkets is not using it meaningfully. 
  // Wait, loadMarkets calls setMarkets. But markets value is unused. 
  // Let's check loadMarkets usage. It is used in useEffect.
  // Ideally we keep the state if we want to support switching back to a full market list later, but to fix lint, we can suppress or just use it.
  // Actually, simpler: I'll just remove the `markets` from the destructuring if it's not used, or allow it to be unused with a leading underscore? 
  // The error is 'markets' is unused. 'selectedMarketId' unused.


  // Auth & Admin State
  const [user, setUser] = useState(authService.getUser())
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    // Initial data load
    const loadMarkets = async () => {
      try {
        const marketsData = await marketService.getAll()
        setMarkets(marketsData)
      } catch (error) {
        console.error('Pazarlar yüklenemedi:', error)
      }
    }
    loadMarkets()

    // Auth poller
    const interval = setInterval(() => {
      setUser(authService.getUser())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const userRole = user?.role || ''
  const isAdmin = userRole === 'ADMIN'

  // Handlers
  const handleMarketSelect = (_market: Market, targetProduct?: Product) => {
    // setSelectedMarketId(market.id) removed
    setCurrentView('market')

    // If a specific product was clicked from global search or ChatBot
    if (targetProduct) {
      setSelectedProduct(targetProduct)
      setProducts([targetProduct]) // Show this product in list
    } else {
      // Reset if just entering market
      setProducts([])
      setSelectedProduct(null)
    }
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    // setSelectedMarketId('') removed
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    setUser(authService.getUser())
  }

  return (
    <div className="app">
      <Header
        onLoginClick={() => setShowLoginModal(true)}
        user={user}
        onAdminClick={() => setShowAdminPanel(true)}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <Login
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Admin Panel Toggle/View */}
      {isAdmin && showAdminPanel ? (
        <div className="admin-wrapper">
          <button className="back-btn" onClick={() => setShowAdminPanel(false)}>
            ← Siteye Dön
          </button>
          <AdminPanel userRole={userRole} />
        </div>
<<<<<<< HEAD
      ) : (
        /* Main Application Views */
        <>
          {currentView === 'home' && (
            <MarketList
              onSelectMarket={handleMarketSelect}
              isAdmin={isAdmin}
            />
          )}

          {currentView === 'market' && (
            <div className="main-container fade-in">
              <button className="back-to-home-btn" onClick={handleBackToHome}>
                ← Pazarlara Dön
              </button>

              <div className="left-panel">
                <SearchPanel
                  onSearch={(results, suggestions) => {
                    setProducts(results)
                    setAiSuggestions(suggestions)
                  }}
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
                  onSelectProduct={setSelectedProduct}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Global ChatBot */}
      {!showAdminPanel && (
        <ChatBot onNavigate={handleMarketSelect} />
      )}
=======
        <div className="right-panel">
          <MapView
            products={products}
            selectedProduct={selectedProduct}
          />
        </div>
      </div>
>>>>>>> 5eaf920db321008750aedd4d2053b35d07c27d21
    </div>
  )
}

export default App
