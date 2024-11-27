import { Canvas } from "@react-three/fiber"
import Sdf from "./Sdf";

const DPR = 1;

export default function App() {
  return (
    <div className="size-[800px] text-center m-auto">
      <Canvas camera={{ position: [0, 1.5, 4] }} dpr={DPR} className="bg-black" gl={{ preserveDrawingBuffer: true }}>
        <Sdf DPR={DPR} />
      </Canvas>
    </div>
  )
}

