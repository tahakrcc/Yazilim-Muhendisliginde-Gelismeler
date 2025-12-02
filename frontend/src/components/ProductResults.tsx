import { Product } from '../App'
import './ProductResults.css'

interface ProductResultsProps {
  products: Product[]
  selectedProduct: Product | null
  onSelectProduct: (product: Product) => void
}

export default function ProductResults({
  products,
  selectedProduct,
  onSelectProduct,
}: ProductResultsProps) {
  if (products.length === 0) {
    return (
      <div className="product-results">
        <h3>Sonuçlar</h3>
        <p className="no-results">Henüz arama yapılmadı</p>
      </div>
    )
  }

  return (
    <div className="product-results">
      <h3>Sonuçlar ({products.length})</h3>
      <div className="products-list">
        {products.map((product) => (
          <div
            key={product.id}
            className={`product-card ${
              selectedProduct?.id === product.id ? 'selected' : ''
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className="product-header">
              <h4 className="product-name">{product.name}</h4>
              <span className="product-category">{product.category}</span>
            </div>
            <div className="product-price">
              💰 {product.minPrice || 'N/A'} ₺
            </div>
            <div className="product-info">
              <span>📍 Tezgah: {product.stallNumber || '-'}</span>
              <span>🏪 {product.vendorName || '-'}</span>
            </div>
            {product.allPrices && product.allPrices.length > 1 && (
              <div className="price-comparison">
                <strong>Fiyat Karşılaştırması:</strong>
                {product.allPrices.map((price, idx) => (
                  <div key={idx} className="price-item">
                    <span>
                      {price.stallNumber} - {price.vendorName}
                    </span>
                    <span>{price.price} ₺</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

