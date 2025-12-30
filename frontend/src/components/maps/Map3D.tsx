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

function Stall3D({
  position,
  stallNumber,
  productName,
  isSelected,
  isCheapest,
  isSellerMode,
  onClick
}: {
  position: [number, number, number]
  stallNumber: string
  productName: string
  isSelected: boolean
  isCheapest: boolean
  isSellerMode?: boolean
  onClick?: () => void
}) {
  return (
    <group position={position}>
      <mesh
        position={[0, 1, 0]}
        onClick={(e) => {
          e.stopPropagation()
          if (onClick) onClick()
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          color={isSellerMode ? '#9E9E9E' : (isSelected ? COLORS.WARNING : isCheapest ? COLORS.SUCCESS : COLORS.WARNING)}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.3}
        color={isSelected ? '#F57C00' : '#333'}
        anchorX="center"
        anchorY="middle"
      >
        {stallNumber}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.2}
        color="#666"
        anchorX="center"
        anchorY="middle"
      >
        {productName.substring(0, 10)}
      </Text>
    </group>
  )
}

function Entrance3D() {
  return (
    <group position={[-8, 0, -8]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.ENTRANCE} />
      </mesh>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={COLORS.ENTRANCE}
        anchorX="center"
        anchorY="middle"
      >
        Giriş
      </Text>
    </group>
  )
}

function GridPlane({ onPlaneClick, isSellerMode }: { onPlaneClick: (point: THREE.Vector3) => void, isSellerMode?: boolean }) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // Removed unused useThree

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      receiveShadow
      onClick={(e) => {
        if (!isSellerMode) return
        // e.point is the Vector3 of intersection
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
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // Removed unused ref

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
            <PerspectiveCamera makeDefault position={[15, 15, 15]} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
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

            <Entrance3D />

            {stalls.map((stall: any, idx: number) => {
              const isSelected = selectedProduct?.id === stall.id
              const isCheapest = stall.minPrice &&
                stall.minPrice === Math.min(...stalls.map((s: any) => s.minPrice || Infinity))

              return (
                <Stall3D
                  key={stall.id || idx}
                  position={[stall.x, stall.y || 0, stall.z]} // Ensure Y 0 if undef
                  stallNumber={stall.stallNumber || '?'}
                  productName={stall.name || 'Boş'}
                  isSelected={isSelected}
                  isCheapest={isCheapest}
                  isSellerMode={isSellerMode}
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
        <div className="3d-legend">
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
