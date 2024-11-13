import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useRef } from "react";
import { ShaderMaterial, Uniform, Vector2 } from "three";

import fragmentShader from './shaders/fragmentShader.glsl??raw'
import vertexShader from './shaders/vertexShader.glsl??raw'

const DPR = 1;

export default function App() {
  return (
    <div className="size-[800px] text-center m-auto">
      <Canvas camera={{ position: [0, 0, 6] }} dpr={DPR} className="bg-black" gl={{ preserveDrawingBuffer: true }}>
        <Sdf />
      </Canvas>
    </div>
  )
}

function Sdf() {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const {viewport} = useThree();

  const uniforms = {
    uTime: new Uniform(0.0),
    uResolution: new Uniform(new Vector2()),
  }

  useFrame((state) => {
    const { clock } = state;
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    shaderRef.current.uniforms.uResolution.value = new Vector2(
      800 * DPR,
      800 * DPR
    );
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>

  );
}
