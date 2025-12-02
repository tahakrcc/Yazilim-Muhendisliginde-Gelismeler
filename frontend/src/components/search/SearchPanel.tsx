import { useState, useEffect } from 'react'
import { Product, Market } from '../../types'
import { productService, marketService } from '../../services/api'
import { sortByPrice } from '../../utils'
import './SearchPanel.css'

interface SearchPanelProps {
  onSearch: (products: Product[], suggestions: string[]) => void
  selectedMarket: string
  onMarketChange: (marketId: string) => void
  markets: Market[]
  onMarketsLoaded: (markets: Market[]) => void
}

export default function SearchPanel({
  onSearch,
  selectedMarket,
  onMarketChange,
  markets,
  onMarketsLoaded,
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    loadMarkets()
  }, [])

  const loadMarkets = async () => {
    try {
      const marketsData = await marketService.getAll()
      onMarketsLoaded(marketsData)
    } catch (error) {
      console.error('Pazarlar yüklenemedi:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Lütfen bir ürün adı girin')
      return
    }

    try {
      const marketId = selectedMarket || 'market_1'
      const response = await productService.search(searchQuery, marketId)
      onSearch(response.results, response.aiSuggestions || [])
    } catch (error) {
      console.error('Arama hatası:', error)
      alert('Arama sırasında bir hata oluştu')
    }
  }

  const handleFilterCheapest = async () => {
    try {
      const products = await productService.getAll()
      const sorted = sortByPrice(products)
      onSearch(sorted, [])
    } catch (error) {
      console.error('Filtreleme hatası:', error)
    }
  }

  return (
    <div className="search-panel">
      <h2>🔍 Ürün Ara</h2>
      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ürün adı girin (örn: Domates, Elma...)"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          Ara
        </button>
      </div>

      <div className="filters">
        <h3>Filtrele</h3>
        <select
          value={selectedMarket}
          onChange={(e) => onMarketChange(e.target.value)}
          className="filter-select"
        >
          <option value="">Tüm Pazarlar</option>
          {markets.map((market) => (
            <option key={market.id} value={market.id}>
              {market.name}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">Tüm Kategoriler</option>
          <option value="Sebze">Sebze</option>
          <option value="Meyve">Meyve</option>
        </select>
        <div className="filter-buttons">
          <button onClick={handleFilterCheapest} className="filter-btn">
            💰 En Ucuz
          </button>
          <button className="filter-btn">🌿 En Taze</button>
        </div>
      </div>
    </div>
  )
}

