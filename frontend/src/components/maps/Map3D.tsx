import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import { Product } from '../../types'
import { COLORS } from '../../constants'
import './Map3D.css'
import * as THREE from 'three'

interface Map3DProps {
  products: Product[]
  selectedProduct: Product | null
  onMapClick?: (x: number, y: number, z: number) => void
  isSellerMode?: boolean
  marketData?: any
}

const WALL_HEIGHT = 4;

function DetailedStall({
  position,
  stallNumber,
  productName,
  isSelected,
  isCheapest,
  onClick
}: {
  position: [number, number, number]
  stallNumber: string
  productName: string
  isSelected: boolean
  isCheapest: boolean
  onClick?: () => void
}) {
  const roofColor = isSelected ? '#E65100' : (isCheapest ? '#2E7D32' : '#F57C00');

  return (
    <group position={position}>
      {/* Table Legs */}
      <mesh position={[-0.8, 0.5, -0.8]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0.8, 0.5, -0.8]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[-0.8, 0.5, 0.8]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0.8, 0.5, 0.8]} castShadow>
        <boxGeometry args={[0.2, 1, 0.2]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Table Top */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#D7CCC8" />
      </mesh>

      {/* Roof Support */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.1, 2, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Roof (Awning) */}
      <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 2.5, 3]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>

      <Text
        position={[0, 1.5, 1.1]}
        fontSize={0.4}
        color={isSelected ? '#F57C00' : '#333'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#fff"
      >
        {stallNumber}
      </Text>
      <Text
        position={[0, 0.5, 1.1]}
        fontSize={0.3}
        color="#333"
        anchorX="center"
        anchorY="middle"
      >
        {productName.substring(0, 12)}
      </Text>
    </group>
  )
}

function MarketWalls() {
  return (
    <group>
      {/* Back Wall */}
      <mesh position={[0, WALL_HEIGHT / 2, -10.5]} receiveShadow>
        <boxGeometry args={[21, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      {/* Front Wall (with opening) */}
      <mesh position={[-6, WALL_HEIGHT / 2, 10.5]} receiveShadow>
        <boxGeometry args={[9, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      <mesh position={[6, WALL_HEIGHT / 2, 10.5]} receiveShadow>
        <boxGeometry args={[9, WALL_HEIGHT, 1]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      {/* Top lintel for entrance */}
      <mesh position={[0, 3.5, 10.5]} receiveShadow>
        <boxGeometry args={[3, 1, 1]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10.5, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[1, WALL_HEIGHT, 22]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[10.5, WALL_HEIGHT / 2, 0]} receiveShadow>
        <boxGeometry args={[1, WALL_HEIGHT, 22]} />
        <meshStandardMaterial color="#E0E0E0" />
      </mesh>
    </group>
  )
}

function Entrance3D() {
  return (
    <group position={[0, 0, 12]}>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.8}
        color={COLORS.ENTRANCE}
        anchorX="center"
        anchorY="middle"
      >
        GİRİŞ
      </Text>
    </group>
  )
}

function GridPlane({ onPlaneClick, isSellerMode }: { onPlaneClick: (point: THREE.Vector3) => void, isSellerMode?: boolean }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
      onClick={(e) => {
        if (!isSellerMode) return
        onPlaneClick(e.point)
      }}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#f5f5f5" />
    </mesh>
  )
}

export default function Map3D({ products, selectedProduct, onMapClick, isSellerMode, marketData }: Map3DProps) {
  const [currentFloor, setCurrentFloor] = useState(0)

  // Use marketData stalls if available, else derive from products
  const stalls = marketData?.map3D?.stalls || marketData?.map2D?.stalls || products
    .filter((p) => p.location)
    .map((product) => ({
      ...product,
      x: (product.location!.x / 100) * 10 - 5,
      y: currentFloor * 3, // simplified mapping
      z: (product.location!.y / 100) * 10 - 5,
    }))

  const handlePlaneClick = (point: THREE.Vector3) => {
    if (!onMapClick) return

    const x = Math.round(point.x)
    const z = Math.round(point.z)

    const isOccupied = stalls.some((s: any) => Math.abs(s.x - x) < 1 && Math.abs(s.z - z) < 1)

    if (!isOccupied) {
      onMapClick(x, 0, z)
    }
  }

  return (
    <div className="map-3d-container">
      <div className="floor-controls">
        <button
          className={`floor-btn ${currentFloor === 0 ? 'active' : ''}`}
          onClick={() => setCurrentFloor(0)}
        >
          Zemin Kat
        </button>
        <button
          className={`floor-btn ${currentFloor === 1 ? 'active' : ''}`}
          onClick={() => setCurrentFloor(1)}
        >
          1. Kat
        </button>
      </div>
      <div className="canvas-container">
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[12, 12, 12]} />
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.2}
              castShadow
            />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            <GridPlane onPlaneClick={handlePlaneClick} isSellerMode={isSellerMode} />

            {/* Grid çizgileri */}
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={`x-${i}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      -10 + i,
                      0,
                      -10,
                      -10 + i,
                      0,
                      10,
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#e0e0e0" />
              </line>
            ))}
            {Array.from({ length: 21 }).map((_, i) => (
              <line key={`z-${i}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      -10,
                      0,
                      -10 + i,
                      10,
                      0,
                      -10 + i,
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#e0e0e0" />
              </line>
            ))}

            <MarketWalls />
            <Entrance3D />

            {stalls.map((stall: any, idx: number) => {
              const isSelected = selectedProduct?.id === stall.id
              const isCheapest = stall.minPrice &&
                stall.minPrice === Math.min(...stalls.map((s: any) => s.minPrice || Infinity))

              return (
                <DetailedStall
                  key={stall.id || idx}
                  position={[stall.x, stall.y || 0, stall.z]}
                  stallNumber={stall.stallNumber || '?'}
                  productName={stall.name || 'Boş'}
                  isSelected={isSelected}
                  isCheapest={isCheapest}
                  onClick={() => console.log("Clicked stall")}
                />
              )
            })}

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={30}
            />
          </Suspense>
        </Canvas>
      </div>
      {!isSellerMode && (
        <div className="map-3d-legend">
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
