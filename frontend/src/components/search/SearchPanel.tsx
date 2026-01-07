import { useState, useEffect } from 'react'
import { Product } from '../../types'
// import { marketService } from '../../services/api' // Removing unused import
import './SearchPanel.css'

interface SearchPanelProps {
  onSearch: (products: Product[], suggestions: string[]) => void
  // Removed unused props to fix build error TS6133
  // selectedMarket, onMarketChange, markets, onMarketsLoaded were unused in this new simplified design
}

export default function SearchPanel({
  onSearch,
}: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Simple fuzzy matching function (Levenshtein Distance)
  const getLevenshteinDistance = (a: string, b: string) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Lütfen bir ürün adı girin')
      return
    }

    try {
      // Mock Data Pool - Expanded for testing
      const mockDb: Product[] = [
        { id: 'p1', name: 'Salkım Domates', category: 'Sebze', unit: 'kg', location: { x: 5, y: 5, z: 0 }, minPrice: 25 },
        { id: 'p2', name: 'Kokteyl Domates', category: 'Sebze', unit: 'kg', location: { x: 6, y: 5, z: 0 }, minPrice: 35 },
        { id: 'p3', name: 'Amasya Elması', category: 'Meyve', unit: 'kg', location: { x: 2, y: 2, z: 0 }, minPrice: 20 },
        { id: 'p4', name: 'Çarliston Biber', category: 'Sebze', unit: 'kg', location: { x: 3, y: 3, z: 0 }, minPrice: 40 },
        { id: 'p5', name: 'Çengelköy Salatalık', category: 'Sebze', unit: 'kg', location: { x: 4, y: 4, z: 0 }, minPrice: 30 },
        { id: 'p6', name: 'Patates', category: 'Sebze', unit: 'kg', location: { x: 1, y: 1, z: 0 }, minPrice: 15 },
        { id: 'p7', name: 'Kuru Soğan', category: 'Sebze', unit: 'kg', location: { x: 1, y: 2, z: 0 }, minPrice: 12 },
        { id: 'p8', name: 'Maydanoz', category: 'Sebze', unit: 'bağ', location: { x: 2, y: 4, z: 0 }, minPrice: 10 }
      ]

      const q = searchQuery.toLowerCase().trim()
      const results: Product[] = []

      // 1. Exact or Partial Match
      const exactMatches = mockDb.filter(p => p.name.toLowerCase().includes(q))
      results.push(...exactMatches)

      // 2. Fuzzy Match (if needed)
      if (results.length === 0) {
        mockDb.forEach(p => {
          // Check distance for simple words "salatalık" vs "saltalık"
          // Threshold: 3 edits allowed
          const words = p.name.toLowerCase().split(' ')
          let isClose = false

          // Check against full name
          if (getLevenshteinDistance(q, p.name.toLowerCase()) <= 3) isClose = true

          // Check against individual words
          words.forEach(w => {
            if (getLevenshteinDistance(q, w) <= 3) isClose = true
          })

          if (isClose) results.push(p)
        })
      }

      // De-duplicate by ID
      const uniqueResults = Array.from(new Set(results.map(r => r.id)))
        .map(id => results.find(r => r.id === id)!)

      // Fallback if still empty
      if (uniqueResults.length === 0) {
        uniqueResults.push({ id: 'p99', name: `${searchQuery} (Buralarda Olabilir)`, category: 'Genel', unit: 'adet', location: { x: 5, y: 5, z: 0 }, minPrice: 0 })
      }

      onSearch(uniqueResults, [])

    } catch (error) {
      console.error('Arama hatası:', error)
    }
  }

  // Initial load
  useEffect(() => {
    // Just to ensure parent knows markets are loaded if needed, but we removed that prop usage.
    // In a real scenario we might fetch initial random products.
  }, [])


  return (
    <div className="search-panel">
      <h2>🔍 Pazar İçi Arama</h2>
      <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '15px' }}>
        Tezgahını bulmak istediğiniz ürünü yazın (Örn: "saltalık" yazsanız bile buluruz)
      </p>

      <div className="search-box">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ürün adı (Domates, Biber, Salatalık...)"
          className="search-input"
          autoFocus
        />
        <button onClick={handleSearch} className="search-btn">
          Bul
        </button>
      </div>

    </div>
  )
}
