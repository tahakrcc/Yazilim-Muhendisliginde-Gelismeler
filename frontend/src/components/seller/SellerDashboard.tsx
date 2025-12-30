import { useState, useEffect } from 'react'
import { Market } from '../../types'
import { marketService } from '../../services/api'
import Map2D from '../maps/Map2D'
import Map3D from '../maps/Map3D'
import AddProductModal from './AddProductModal'
import './SellerDashboard.css'

interface SellerDashboardProps {
  userRole: string
}

export default function SellerDashboard({ }: SellerDashboardProps) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [markets, setMarkets] = useState<Market[]>([])
  const [selectedMarketId, setSelectedMarketId] = useState<string>('')
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null) // Use any for extended market data
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d')
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ x: number, y: number, z: number } | null>(null)

  useEffect(() => {
    loadMarkets()
  }, [])

  useEffect(() => {
    if (selectedMarketId) {
      loadMarketDetails(selectedMarketId)
    }
  }, [selectedMarketId])

  const loadMarkets = async () => {
    try {
      const data = await marketService.getAll()
      setMarkets(data)
      if (data.length > 0) {
        setSelectedMarketId(data[0].id)
      }
    } catch (error) {
      console.error('Pazarlar yüklenemedi:', error)
    }
  }

  const loadMarketDetails = async (id: string) => {
    try {
      const data = await marketService.getMap(id)
      const marketBasic = markets.find(m => m.id === id)
      if (marketBasic) {
        setSelectedMarket({
          ...marketBasic,
          map2D: data.map2D,
          map3D: data.map3D
        })
      }
    } catch (error) {
      console.error('Pazar detayları yüklenemedi:', error)
    }
  }

  const handleMapClick = (position: { x: number, y: number, z: number }) => {
    setSelectedPosition(position)
    setShowAddProductModal(true)
  }

  return (
    <div className="seller-dashboard">
      <div className="seller-header">
        <h2>🏪 Satıcı Paneli</h2>
        <div className="market-selector">
          <label>Pazar Seç:</label>
          <select
            value={selectedMarketId}
            onChange={(e) => setSelectedMarketId(e.target.value)}
          >
            {markets.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="seller-content">
        <div className="instructions">
          <h3>Nasıl Satış Yapılır?</h3>
          <p>1. Aşağıdaki haritadan boş bir ver (veya kendi tezgahınızı) seçin.</p>
          <p>2. Açılan pencerede ürün bilgilerinizi girin.</p>
          <p>3. "Satışa Başla" butonuna tıklayın.</p>
        </div>

        <div className="map-controls">
          <button
            className={`tab-btn ${activeTab === '2d' ? 'active' : ''}`}
            onClick={() => setActiveTab('2d')}
          >
            🗺️ 2D Harita
          </button>
          <button
            className={`tab-btn ${activeTab === '3d' ? 'active' : ''}`}
            onClick={() => setActiveTab('3d')}
          >
            🌐 3D Görünüm
          </button>
        </div>

        <div className="seller-map-container">
          {selectedMarket && (
            activeTab === '2d' ? (
              <Map2D
                products={[]}
                selectedProduct={null}
                onMapClick={(x: number, y: number) => handleMapClick({ x, y, z: 0 })}
                isSellerMode={true}
                marketData={selectedMarket}
              />
            ) : (
              <Map3D
                products={[]}
                selectedProduct={null}
                onMapClick={(x: number, y: number, z: number) => handleMapClick({ x, y, z })}
                isSellerMode={true}
                marketData={selectedMarket}
              />
            )
          )}
        </div>
      </div>

      {showAddProductModal && selectedPosition && selectedMarketId && (
        <AddProductModal
          marketId={selectedMarketId}
          position={selectedPosition}
          onClose={() => setShowAddProductModal(false)}
          onSuccess={() => {
            setShowAddProductModal(false)
            loadMarketDetails(selectedMarketId)
          }}
        />
      )}
    </div>
  )
}
