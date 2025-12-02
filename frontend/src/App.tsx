import { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import SearchPanel from './components/search/SearchPanel'
import MapView from './components/maps/MapView'
import ProductResults from './components/products/ProductResults'
import { Product, Market } from './types'
import { marketService } from './services/api'
import './App.css'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMarket, setSelectedMarket] = useState<string>('market_1')
  const [, setAiSuggestions] = useState<string[]>([])
  const [markets, setMarkets] = useState<Market[]>([])

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
  }, [])

  return (
    <div className="app">
      <Header />
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
    </div>
  )
}

export default App

