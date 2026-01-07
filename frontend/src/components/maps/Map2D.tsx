import { useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva'
import { Product } from '../../types'
import { MAP_CONFIG, COLORS } from '../../constants'
import './Map2D.css'

interface Map2DProps {
  products: Product[]
  selectedProduct: Product | null
  onMapClick?: (x: number, y: number) => void
  onStallClick?: (product: Product) => void
  isSellerMode?: boolean
  marketData?: any
}

export default function Map2D({ products, selectedProduct, onMapClick, onStallClick, isSellerMode, marketData }: Map2DProps) {
  const stageRef = useRef<any>(null)

  useEffect(() => {
    // Harita yeniden çizildiğinde
  }, [products, selectedProduct, marketData])

  // If marketData provided, use its stalls. Otherwise fallback to deriving from products (legacy/search mode)
  // Ensure we map to Product type cleanly
  const stalls = (marketData?.map2D?.stalls || (products.length > 0 ? products : generateMockStalls())).map((product: Product) => ({
    ...product,
    // Ensure accurate pixel positioning. If product has existing x/y (legacy mock pixels), use them directly?
    // Or if it has location object {x,y} (grid coords), convert to pixels.
    // Let's assume location object is the source of truth for grid coords.
    x: (product.location?.x || 0) * MAP_CONFIG.GRID_SIZE + MAP_CONFIG.GRID_SIZE / 2,
    y: (product.location?.y || 0) * MAP_CONFIG.GRID_SIZE + MAP_CONFIG.GRID_SIZE / 2,
    id: product.id,
    name: product.name,
    stallNumber: product.stallNumber || `T-${product.id}`
  }))

  function generateMockStalls(): Product[] {
    // Generate some dummy stalls for visual context if no search is active
    const dummies: Product[] = []
    // Create a few rows of stalls
    for (let row = 1; row < 5; row++) {
      for (let col = 1; col < 8; col++) {
        // Skip some to make it look organic
        if ((row + col) % 3 === 0) continue;
        dummies.push({
          id: `mock-${row}-${col}`,
          name: 'Boş Tezgah',
          location: { x: col, y: row, z: 0 },
          stallNumber: `A-${row}${col}`,
          category: 'Genel',
          unit: 'adet',
          minPrice: 0,
          vendorName: 'Müsait' // Valid property from Product interface
        })
      }
    }
    return dummies;
  }

  const handleStageClick = (e: any) => {
    if (!isSellerMode || !onMapClick) return

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    const x = Math.floor(pointerPosition.x / MAP_CONFIG.GRID_SIZE)
    const y = Math.floor(pointerPosition.y / MAP_CONFIG.GRID_SIZE)

    // Check availability logic...
    onMapClick(x, y)
  }

  const handleStallClick = (stall: any) => {
    console.log('Stall clicked:', stall)
    if (onStallClick) {
      // Pass back as a Product object
      onStallClick(stall)
    }
  }

  return (
    <div className="map-2d-container">
      <Stage
        width={MAP_CONFIG.WIDTH}
        height={MAP_CONFIG.HEIGHT}
        ref={stageRef}
        className="konva-stage"
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Grid ve Arkaplan */}
          <Rect
            x={0}
            y={0}
            width={MAP_CONFIG.WIDTH}
            height={MAP_CONFIG.HEIGHT}
            fill="#fff"
            listening={true}
          />

          {/* WALLS */}
          {/* Top Wall */}
          <Rect x={0} y={0} width={MAP_CONFIG.WIDTH} height={5} fill="#555" />
          {/* Bottom Wall */}
          <Rect x={0} y={MAP_CONFIG.HEIGHT - 5} width={MAP_CONFIG.WIDTH} height={5} fill="#555" />
          {/* Left Wall */}
          <Rect x={0} y={0} width={5} height={MAP_CONFIG.HEIGHT} fill="#555" />
          {/* Right Wall */}
          <Rect x={MAP_CONFIG.WIDTH - 5} y={0} width={5} height={MAP_CONFIG.HEIGHT} fill="#555" />

          {/* Floor Texture / Pattern (Light gray background for active area) */}
          <Rect
            x={5} y={5}
            width={MAP_CONFIG.WIDTH - 10}
            height={MAP_CONFIG.HEIGHT - 10}
            fill="#f9f9f9"
            listening={true}
          />

          {/* Grid çizgileri */}
          {Array.from({ length: MAP_CONFIG.WIDTH / MAP_CONFIG.GRID_SIZE + 1 }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={i * MAP_CONFIG.GRID_SIZE}
              y={0}
              width={1}
              height={MAP_CONFIG.HEIGHT}
              fill="#e0e0e0"
              listening={false}
            />
          ))}
          {Array.from({ length: MAP_CONFIG.HEIGHT / MAP_CONFIG.GRID_SIZE + 1 }).map((_, i) => (
            <Rect
              key={`h-${i}`}
              x={0}
              y={i * MAP_CONFIG.GRID_SIZE}
              width={MAP_CONFIG.WIDTH}
              height={1}
              fill="#e0e0e0"
              listening={false}
            />
          ))}

          {/* Giriş noktası */}
          <Group x={20} y={20}>
            <Circle radius={12} fill={COLORS.ENTRANCE} listening={false} />
            <Text
              text="Giriş"
              fontSize={12}
              fill="#333"
              x={-15}
              y={18}
              fontStyle="bold"
              listening={false}
            />
          </Group>

          {/* Tezgahlar */}
          {stalls.map((stall: any, idx: number) => {
            const isSelected = selectedProduct?.id === stall.id
            const isCheapest = stall.minPrice &&
              stall.minPrice === Math.min(...stalls.map((s: any) => s.minPrice || Infinity))

            return (
              <Group
                key={stall.id || idx}
                x={stall.x}
                y={stall.y}
                listening={!isSellerMode} // In seller mode, stalls might not be clickable or handled differently
                onClick={() => handleStallClick(stall)}
                onTap={() => handleStallClick(stall)}
              >
                <Rect
                  width={34}
                  height={34}
                  x={-17}
                  y={-17}
                  fill={isSellerMode ? '#9E9E9E' : (isSelected ? COLORS.WARNING : isCheapest ? COLORS.SUCCESS : COLORS.WARNING)}
                  stroke={isSelected ? '#F57C00' : '#E65100'}
                  strokeWidth={2}
                  cornerRadius={4}
                  shadowBlur={isSelected ? 10 : 5}
                  shadowColor="rgba(0,0,0,0.3)"
                />
                <Text
                  text={stall.stallNumber || '?'}
                  fontSize={10}
                  fill="white"
                  fontStyle="bold"
                  x={-15}
                  y={-5}
                  align="center"
                  width={30}
                />
                {stall.type && (
                  <Text
                    text={stall.type}
                    fontSize={8}
                    fill="#333"
                    x={-20}
                    y={20}
                    align="center"
                    width={40}
                  />
                )}
              </Group>
            )
          })}

          {isSellerMode && (
            <Text
              text="Boş bir kareye tıklayarak tezgah açın"
              x={100}
              y={10}
              fontSize={14}
              fill="red"
              fontStyle='bold'
            />
          )}

        </Layer>
      </Stage>
      {!isSellerMode && (
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ background: COLORS.SUCCESS }}></div>
            <span>En Ucuz</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: COLORS.WARNING }}></div>
            <span>Diğer Tezgahlar</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: COLORS.ENTRANCE }}></div>
            <span>Giriş</span>
          </div>
        </div>
      )}
    </div>
  )
}
