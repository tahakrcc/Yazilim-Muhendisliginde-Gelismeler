import { useEffect, useRef } from 'react'
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva'
import { Product } from '../../types'
import { MAP_CONFIG, COLORS } from '../../constants'
import './Map2D.css'

interface Map2DProps {
  products: Product[]
  selectedProduct: Product | null
}

export default function Map2D({ products, selectedProduct }: Map2DProps) {
  const stageRef = useRef<any>(null)

  useEffect(() => {
    // Harita yeniden çizildiğinde
  }, [products, selectedProduct])

  const stalls = products
    .filter((p) => p.location)
    .map((product) => ({
      ...product,
      x: product.location!.x,
      y: product.location!.y,
    }))

  const handleStallClick = (product: Product) => {
    console.log('Stall clicked:', product)
  }

  return (
    <div className="map-2d-container">
      <Stage
        width={MAP_CONFIG.WIDTH}
        height={MAP_CONFIG.HEIGHT}
        ref={stageRef}
        className="konva-stage"
      >
        <Layer>
          {/* Grid çizgileri */}
          {Array.from({ length: MAP_CONFIG.WIDTH / MAP_CONFIG.GRID_SIZE + 1 }).map((_, i) => (
            <Rect
              key={`v-${i}`}
              x={i * MAP_CONFIG.GRID_SIZE}
              y={0}
              width={1}
              height={MAP_CONFIG.HEIGHT}
              fill="#e0e0e0"
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
            />
          ))}

          {/* Giriş noktası */}
          <Group x={20} y={20}>
            <Circle radius={12} fill={COLORS.ENTRANCE} />
            <Text
              text="Giriş"
              fontSize={12}
              fill="#333"
              x={-15}
              y={18}
              fontStyle="bold"
            />
          </Group>

          {/* Tezgahlar */}
          {stalls.map((stall) => {
            const isSelected = selectedProduct?.id === stall.id
            const isCheapest =
              stall.minPrice ===
              Math.min(...stalls.map((s) => s.minPrice || Infinity))

            return (
              <Group
                key={stall.id}
                x={stall.x}
                y={stall.y}
                onClick={() => handleStallClick(stall)}
                onTap={() => handleStallClick(stall)}
              >
                <Rect
                  width={40}
                  height={40}
                  x={-20}
                  y={-20}
                  fill={isSelected ? COLORS.WARNING : isCheapest ? COLORS.SUCCESS : COLORS.WARNING}
                  stroke={isSelected ? '#F57C00' : '#E65100'}
                  strokeWidth={2}
                  cornerRadius={4}
                  shadowBlur={isSelected ? 10 : 5}
                  shadowColor="rgba(0,0,0,0.3)"
                />
                <Text
                  text={stall.stallNumber || '?'}
                  fontSize={12}
                  fill="white"
                  fontStyle="bold"
                  x={-15}
                  y={-8}
                  align="center"
                />
                <Text
                  text={stall.name.substring(0, 8)}
                  fontSize={10}
                  fill="#333"
                  x={-25}
                  y={25}
                  align="center"
                />
              </Group>
            )
          })}
        </Layer>
      </Stage>
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
    </div>
  )
}

