import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"

export default function App() {
  return (
    <div className="size-[800px] text-center m-auto">
      <Canvas className="bg-black" gl={{ preserveDrawingBuffer: true }}>
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh>
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="red" />
        <OrbitControls />
      </Canvas>
    </div>
  )
}