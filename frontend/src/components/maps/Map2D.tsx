import { useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva'
import { Product } from '../../types'
import { MAP_CONFIG, COLORS } from '../../constants'
import './Map2D.css'

interface Map2DProps {
  products: Product[]
  selectedProduct: Product | null
  onMapClick?: (x: number, y: number) => void
  isSellerMode?: boolean
  marketData?: any
}

export default function Map2D({ products, selectedProduct, onMapClick, isSellerMode, marketData }: Map2DProps) {
  const stageRef = useRef<any>(null)

  useEffect(() => {
    // Harita yeniden çizildiğinde
  }, [products, selectedProduct, marketData])

  // If marketData provided, use its stalls. Otherwise fallback to deriving from products (legacy/search mode)
  const stalls = marketData?.map2D?.stalls || products
    .filter((p) => p.location)
    .map((product) => ({
      ...product,
      x: product.location!.x,
      y: product.location!.y,
      // Map legacy product structure to stalls structure if needed
      id: product.id, // or generated ID
      name: product.name,
      stallNumber: product.stallNumber
    }))

  const handleStageClick = (e: any) => {
    if (!isSellerMode || !onMapClick) return

    // Clicked on empty space?
    // Convert click position to grid coordinates
    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()

    // Snap to grid
    const x = Math.floor(pointerPosition.x / MAP_CONFIG.GRID_SIZE) * MAP_CONFIG.GRID_SIZE + MAP_CONFIG.GRID_SIZE / 2
    const y = Math.floor(pointerPosition.y / MAP_CONFIG.GRID_SIZE) * MAP_CONFIG.GRID_SIZE + MAP_CONFIG.GRID_SIZE / 2

    // Check if occupied
    // Use a simple distance check or exact grid match
    const isOccupied = stalls.some((s: any) => Math.abs(s.x - x) < 20 && Math.abs(s.y - y) < 20)

    if (!isOccupied) {
      onMapClick(x, y)
    }
  }

  const handleStallClick = (stall: any) => {
    console.log('Stall clicked:', stall)
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
            listening={true} // Catch clicks
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
