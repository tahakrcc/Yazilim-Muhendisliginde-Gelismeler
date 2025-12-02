import { useState } from 'react'
import { Product } from '../../types'
import Map2D from './Map2D'
import Map3D from './Map3D'
import { formatPrice } from '../../utils'
import './MapView.css'

interface MapViewProps {
  products: Product[]
  selectedProduct: Product | null
}

export default function MapView({
  products,
  selectedProduct,
}: MapViewProps) {
  const [activeTab, setActiveTab] = useState<'2d' | '3d'>('2d')

  return (
    <div className="map-view-container">
      <div className="map-tabs">
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

      <div className="map-content">
        {activeTab === '2d' ? (
          <Map2D products={products} selectedProduct={selectedProduct} />
        ) : (
          <Map3D products={products} selectedProduct={selectedProduct} />
        )}
      </div>

      {selectedProduct && (
        <div className="stall-details">
          <h3>Tezgah Detayları</h3>
          <div className="detail-card">
            <div className="detail-item">
              <strong>Tezgah:</strong> {selectedProduct.stallNumber || '-'}
            </div>
            <div className="detail-item">
              <strong>Satıcı:</strong> {selectedProduct.vendorName || '-'}
            </div>
            <div className="detail-item">
              <strong>Fiyat:</strong> {formatPrice(selectedProduct.minPrice)}
            </div>
            {selectedProduct.location && (
              <div className="detail-item">
                <strong>Konum:</strong> X: {selectedProduct.location.x}, Y:{' '}
                {selectedProduct.location.y}
              </div>
            )}
          </div>
          <div className="route-info">
            <h4>📍 Yol Tarifi</h4>
            <p>
              Pazar girişinden {selectedProduct.stallNumber} numaralı tezgaha
              yürüyün.
            </p>
            <p>Tahmini süre: 2-3 dakika</p>
          </div>
        </div>
      )}
    </div>
  )
}

