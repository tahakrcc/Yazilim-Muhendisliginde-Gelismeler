import { useState, useEffect } from 'react'
import { Product, Market } from '../../types'
import { productService, marketService } from '../../services/api'
import { adminService } from '../../services/admin'
import './AdminPanel.css'

interface AdminPanelProps {
  userRole: string
}

export default function AdminPanel({ userRole }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'markets' | 'dashboard'>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [markets, setMarkets] = useState<Market[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [showMarketForm, setShowMarketForm] = useState(false)
  const [showPriceForm, setShowPriceForm] = useState(false)
  const [selectedProductForPrice, setSelectedProductForPrice] = useState<Product | null>(null)
  const [productPrices, setProductPrices] = useState<Map<string, any[]>>(new Map())
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingMarket, setEditingMarket] = useState<Market | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadProductPrices = async (productId: string) => {
    if (!productService || typeof productService.getPrices !== 'function') {
      return []
    }
    
    try {
      const prices: any[] = []
      for (const market of markets) {
        try {
          const priceData = await productService.getPrices(productId, market.id)
          if (priceData?.prices && Array.isArray(priceData.prices)) {
            priceData.prices.forEach((p: any) => {
              prices.push({ ...p, marketId: market.id, marketName: market.name })
            })
          }
        } catch (error) {
          // Ürün bu pazarda yoksa hata vermesin
        }
      }
      return prices
    } catch (error) {
      console.warn('Fiyatlar yüklenirken hata oluştu:', error)
      return []
    }
  }

  const loadData = async () => {
    try {
      const [productsData, marketsData] = await Promise.all([
        productService.getAll(),
        marketService.getAll()
      ])
      setProducts(productsData)
      setMarkets(marketsData)
      
      // Fiyatları başlangıçta boş olarak ayarla
      const pricesMap = new Map<string, any[]>()
      productsData.forEach(product => {
        pricesMap.set(product.id, [])
      })
      setProductPrices(pricesMap)
      
      // Fiyatları arka planda yükle
      productsData.forEach(async (product) => {
        const prices = await loadProductPrices(product.id)
        setProductPrices(prev => {
          const newMap = new Map(prev)
          newMap.set(product.id, prices)
          return newMap
        })
      })
    } catch (error) {
      console.error('Veri yüklenemedi:', error)
    }
  }

  const handleProductSubmit = async (productData: any) => {
    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, productData)
      } else {
        await adminService.createProduct(productData)
      }
      await loadData()
      setShowProductForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Ürün kaydedilemedi:', error)
      alert('Ürün kaydedilemedi!')
    }
  }

  const handleMarketSubmit = async (marketData: any) => {
    try {
      if (editingMarket) {
        await adminService.updateMarket(editingMarket.id, marketData)
      } else {
        await adminService.createMarket(marketData)
      }
      await loadData()
      setShowMarketForm(false)
      setEditingMarket(null)
    } catch (error) {
      console.error('Pazar kaydedilemedi:', error)
      alert('Pazar kaydedilemedi!')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return
    
    try {
      await adminService.deleteProduct(productId)
      await loadData()
    } catch (error) {
      console.error('Ürün silinemedi:', error)
      alert('Ürün silinemedi!')
    }
  }

  const handleDeleteMarket = async (marketId: string) => {
    if (!confirm('Bu pazarı silmek istediğinizden emin misiniz?')) return
    
    try {
      await adminService.deleteMarket(marketId)
      await loadData()
    } catch (error) {
      console.error('Pazar silinemedi:', error)
      alert('Pazar silinemedi!')
    }
  }

  const handleAddPrice = async (priceData: any) => {
    try {
      await adminService.addProductToMarket(priceData.marketId, {
        productId: selectedProductForPrice?.id,
        price: parseFloat(priceData.price),
        stallNumber: priceData.stallNumber,
        x: parseInt(priceData.x),
        y: parseInt(priceData.y),
        z: parseInt(priceData.z || '0'),
        vendorName: priceData.vendorName
      })
      
      // Sadece ilgili ürünün fiyatlarını yeniden yükle
      if (selectedProductForPrice) {
        const prices = await loadProductPrices(selectedProductForPrice.id)
        setProductPrices(prev => {
          const newMap = new Map(prev)
          newMap.set(selectedProductForPrice.id, prices)
          return newMap
        })
      }
      
      setShowPriceForm(false)
      setSelectedProductForPrice(null)
    } catch (error) {
      console.error('Fiyat eklenemedi:', error)
      alert('Fiyat eklenemedi!')
    }
  }

  const handleRemovePrice = async (marketId: string, productId: string, stallNumber: string) => {
    if (!confirm('Bu fiyatı silmek istediğinizden emin misiniz?')) return
    
    try {
      await adminService.removeProductFromMarket(marketId, productId, stallNumber)
      await loadData()
    } catch (error) {
      console.error('Fiyat silinemedi:', error)
      alert('Fiyat silinemedi!')
    }
  }

  if (userRole !== 'ADMIN') {
    return null
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>🔧 Admin Paneli</h2>
        <div className="admin-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Ürünler
          </button>
          <button 
            className={activeTab === 'markets' ? 'active' : ''}
            onClick={() => setActiveTab('markets')}
          >
            Pazarlar
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Toplam Ürün</h3>
                <p className="stat-number">{products.length}</p>
              </div>
              <div className="stat-card">
                <h3>Toplam Pazar</h3>
                <p className="stat-number">{markets.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-management">
            <div className="management-header">
              <h3>Ürün Yönetimi</h3>
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditingProduct(null)
                  setShowProductForm(true)
                }}
              >
                + Yeni Ürün Ekle
              </button>
            </div>
            <div className="items-list">
              {products.map(product => {
                const prices = productPrices.get(product.id) || []
                return (
                  <div key={product.id} className="item-card expanded">
                    <div className="item-info">
                      <h4>{product.name}</h4>
                      <p>Kategori: {product.category}</p>
                      <p>Birim: {product.unit}</p>
                      {prices.length > 0 && (
                        <div className="prices-section">
                          <strong>Fiyatlar:</strong>
                          <div className="prices-list">
                            {prices.map((price, idx) => (
                              <div key={idx} className="price-item">
                                <span>{price.marketName}: {price.price} TL - Tezgah: {price.stallNumber}</span>
                                <button
                                  className="btn-small-delete"
                                  onClick={() => handleRemovePrice(price.marketId, product.id, price.stallNumber)}
                                  title="Fiyatı Sil"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="item-actions">
                      <button 
                        className="btn-price"
                        onClick={() => {
                          setSelectedProductForPrice(product)
                          setShowPriceForm(true)
                        }}
                        title="Fiyat Ekle"
                      >
                        💰 Fiyat Ekle
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => {
                          setEditingProduct(product)
                          setShowProductForm(true)
                        }}
                      >
                        Düzenle
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="markets-management">
            <div className="management-header">
              <h3>Pazar Yönetimi</h3>
              <button 
                className="btn-primary"
                onClick={() => {
                  setEditingMarket(null)
                  setShowMarketForm(true)
                }}
              >
                + Yeni Pazar Ekle
              </button>
            </div>
            <div className="items-list">
              {markets.map(market => (
                <div key={market.id} className="item-card">
                  <div className="item-info">
                    <h4>{market.name}</h4>
                    <p>Adres: {market.address}</p>
                    <p>Çalışma Saatleri: {market.openingHours}</p>
                  </div>
                  <div className="item-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => {
                        setEditingMarket(market)
                        setShowMarketForm(true)
                      }}
                    >
                      Düzenle
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteMarket(market.id)}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
          onSubmit={handleProductSubmit}
        />
      )}

      {showMarketForm && (
        <MarketForm
          market={editingMarket}
          onClose={() => {
            setShowMarketForm(false)
            setEditingMarket(null)
          }}
          onSubmit={handleMarketSubmit}
        />
      )}

      {showPriceForm && selectedProductForPrice && (
        <PriceForm
          product={selectedProductForPrice}
          markets={markets}
          onClose={() => {
            setShowPriceForm(false)
            setSelectedProductForPrice(null)
          }}
          onSubmit={handleAddPrice}
        />
      )}
    </div>
  )
}

function ProductForm({ product, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    unit: product?.unit || 'kg',
    freshness: product?.freshness || 'Taze'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ürün Adı:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Kategori:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Birim:</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Tazelik:</label>
            <input
              type="text"
              value={formData.freshness}
              onChange={(e) => setFormData({ ...formData, freshness: e.target.value })}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Kaydet</button>
            <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MarketForm({ market, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    name: market?.name || '',
    address: market?.address || '',
    latitude: market?.latitude || 0,
    longitude: market?.longitude || 0,
    openingHours: market?.openingHours || '08:00 - 20:00',
    isOpenToday: market?.isOpenToday !== undefined ? market.isOpenToday : true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{market ? 'Pazar Düzenle' : 'Yeni Pazar Ekle'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pazar Adı:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Adres:</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Enlem:</label>
            <input
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label>Boylam:</label>
            <input
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="form-group">
            <label>Çalışma Saatleri:</label>
            <input
              type="text"
              value={formData.openingHours}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isOpenToday}
                onChange={(e) => setFormData({ ...formData, isOpenToday: e.target.checked })}
              />
              Bugün Açık
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Kaydet</button>
            <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PriceForm({ product, markets, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    marketId: markets.length > 0 ? markets[0].id : '',
    price: '',
    stallNumber: '',
    x: '0',
    y: '0',
    z: '0',
    vendorName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>💰 {product.name} için Fiyat Ekle</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Pazar:</label>
            <select
              value={formData.marketId}
              onChange={(e) => setFormData({ ...formData, marketId: e.target.value })}
              required
            >
              {markets.map((market: Market) => (
                <option key={market.id} value={market.id}>
                  {market.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Fiyat (TL):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="18.50"
              required
            />
          </div>
          <div className="form-group">
            <label>Tezgah Numarası:</label>
            <input
              type="text"
              value={formData.stallNumber}
              onChange={(e) => setFormData({ ...formData, stallNumber: e.target.value })}
              placeholder="A-12"
              required
            />
          </div>
          <div className="form-group">
            <label>Satıcı Adı:</label>
            <input
              type="text"
              value={formData.vendorName}
              onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
              placeholder="Ahmet'in Sebzeleri"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>X Koordinatı:</label>
              <input
                type="number"
                value={formData.x}
                onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Y Koordinatı:</label>
              <input
                type="number"
                value={formData.y}
                onChange={(e) => setFormData({ ...formData, y: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Z Koordinatı (Kat):</label>
              <input
                type="number"
                value={formData.z}
                onChange={(e) => setFormData({ ...formData, z: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">Fiyat Ekle</button>
            <button type="button" onClick={onClose} className="btn-secondary">İptal</button>
          </div>
        </form>
      </div>
    </div>
  )
}

