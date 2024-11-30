import { Canvas } from "@react-three/fiber"
import Menger from "./Menger";

const DPR = 1;

export default function App() {
  return (
    <div className="size-[800px] text-center m-auto">
      <Canvas camera={{ position: [0, 1.5, 4] }} dpr={DPR} className="bg-black" gl={{ preserveDrawingBuffer: true }}>
        <Menger DPR={DPR} />
      </Canvas>
    </div>
  )
}

