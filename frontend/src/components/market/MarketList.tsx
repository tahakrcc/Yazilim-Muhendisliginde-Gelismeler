import React, { useState, useEffect } from 'react'
import { Market, Product } from '../../types'
import { MOCK_MARKETS } from '../../data/mockMarkets'
import './MarketList.css'

interface MarketListProps {
  onSelectMarket: (market: Market, targetProduct?: Product) => void
  isAdmin: boolean
}

export default function MarketList({ onSelectMarket, isAdmin }: MarketListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchResults, setSearchResults] = useState<{ product: Product, market: Market }[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Sort Markets: Open First, then Closed
  const sortedMarkets = [...MOCK_MARKETS].sort((a, b) => {
    if (a.isOpenToday === b.isOpenToday) return 0
    return a.isOpenToday ? -1 : 1
  })

  // Global Search Logic using API or Mock
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        // Mocking a "Global Search" or calling API
        // In a real app, this would be a single endpoints like /products/search?global=true
        const results: { product: Product, market: Market }[] = []

        // Simulating API call delay
        await new Promise(r => setTimeout(r, 300))

        // Mock Data Generator for demo purposes since backend search is per-market
        // We'll iterate open markets and 'find' the product
        sortedMarkets.filter(m => m.isOpenToday).forEach(market => {
          // Simple mock matching logic
          if (searchTerm.toLowerCase().includes('domates') || 'domates'.includes(searchTerm.toLowerCase())) {
            results.push({
              product: { id: 'p1', name: 'Salkım Domates', category: 'Sebze', unit: 'kg', location: { x: 1, y: 1, z: 0 }, minPrice: 25 },
              market
            })
          }
        })

        setSearchResults(results)
      } catch (error) {
        console.error(error)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(performSearch, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory])


  const handleEdit = (e: React.MouseEvent, market: Market) => {
    e.stopPropagation()
    alert(`Admin Düzenleme Modu: ${market.name}`)
  }

  const handleResultClick = (item: { product: Product, market: Market }) => {
    onSelectMarket(item.market, item.product)
  }

  return (
    <div className="market-list-container">

      {/* Hero Section with Global Search */}
      <div className="home-hero">
        <h1>Hangi Ürünü Arıyorsunuz?</h1>
        <div className="home-search-wrapper">
          <div className="search-input-group">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              <option value="Sebze">Sebze</option>
              <option value="Meyve">Meyve</option>
            </select>
            <input
              type="text"
              className="search-input-large"
              placeholder="Ürün adı girin (örn: Domates)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Inline Search Results Dropdown */}
          {searchTerm && (
            <div className="search-results-dropdown">
              {isSearching ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>Aranıyor...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div key={idx} className="search-result-item" onClick={() => handleResultClick(item)}>
                    <div className="result-info">
                      <h4>{item.product.name}</h4>
                      <p>{item.market.name}</p>
                    </div>
                    <div className="result-price">
                      {item.product.minPrice} TL
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                  Sonuç bulunamadı (Sadece AÇIK pazarlarda aranıyor)
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="market-list-header">
        <h2>Yakındaki Pazarlar</h2>
        <p>Size en yakın semt pazarlarını keşfedin</p>
      </div>

      <div className="markets-scroll-area">
        {sortedMarkets.map(market => (
          <div
            key={market.id}
            className={`market-card ${!market.isOpenToday ? 'closed' : ''}`}
            onClick={() => market.isOpenToday && onSelectMarket(market)}
            title={!market.isOpenToday ? 'Bu pazar bugün kapalı' : ''}
          >
            {isAdmin && (
              <button className="admin-edit-btn" onClick={(e) => handleEdit(e, market)}>
                Düzenle
              </button>
            )}

            <div className="market-image-container">
              <img src={market.imageUrl} alt={market.name} className="market-image" />
              <div className={`market-status-badge ${market.isOpenToday ? 'status-open' : 'status-closed'}`}>
                {market.isOpenToday ? 'AÇIK' : 'KAPALI'}
              </div>
            </div>

            <div className="market-content">
              <div>
                <h3 className="market-title">{market.name}</h3>
                <p className="market-address">{market.address}</p>
              </div>

              <div className="market-info-row">
                <div className="distance-tag">
                  <span>📍 2.4 km</span> {/* Mock distance */}
                </div>
                {market.isOpenToday ? (
                  <p style={{ color: '#4ade80' }}>{market.openingHours}</p>
                ) : (
                  <p style={{ color: '#ef4444' }}>Bugün Kapalı</p>
                )}

                {market.isOpenToday && (
                  <button className="view-btn">İncele →</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
