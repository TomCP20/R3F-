import { Canvas } from "@react-three/fiber";
import Sdf from "./Sdf";

export default function Scene({ sceneID, pos, angle }: Readonly<{ sceneID: number; pos: (t: number) => [number, number, number]; angle: (t: number) => number; }>) {
    return (
        <div className="size-[800px] text-center m-auto">
            <Canvas camera={{ position: [0, 1.5, 4] }} className="bg-black" gl={{ preserveDrawingBuffer: true }}>
                <Sdf sceneID={sceneID} pos={pos} angle={angle} />
            </Canvas>
        </div>
    )
}