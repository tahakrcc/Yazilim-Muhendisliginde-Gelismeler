import { useState } from 'react'
import Header from './components/Header'
import SearchPanel from './components/SearchPanel'
import MapView from './components/MapView'
import ProductResults from './components/ProductResults'
import './App.css'

export interface Product {
  id: string
  name: string
  category: string
  unit: string
  freshness?: string
  minPrice?: number
  stallNumber?: string
  vendorName?: string
  location?: { x: number; y: number; z: number }
  allPrices?: Array<{ price: number; stallNumber: string; vendorName: string }>
}

export interface Market {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  isOpenToday: boolean
  openingHours: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedMarket, setSelectedMarket] = useState<string>('market_1')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [markets, setMarkets] = useState<Market[]>([])

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
            marketId={selectedMarket}
          />
        </div>
      </div>
    </div>
  )
}

export default App

