import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial, Uniform, Vector2, Vector3 } from "three";

import fragmentShader from './shaders/fragmentShader.glsl??raw'
import vertexShader from './shaders/vertexShader.glsl??raw'

export default function Sdf({ sceneID, pos, angle }: Readonly<{ sceneID: number; pos:(t: number) => [number, number, number]; angle: (t: number) => number; }>) {
  const shaderRef = useRef<ShaderMaterial>(null!);
  const { viewport } = useThree();
  const uniforms = {
    uTime: new Uniform(0.0),
    uResolution: new Uniform(new Vector2(800, 800)),
    uCamPos: new Uniform(new Vector3()),
    uCamAngle: new Uniform(0.0),
    uSceneID: new Uniform(sceneID),
  };

  useFrame((state) => {
    const { clock } = state;
    shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    const [x, y, z] = (pos(clock.getElapsedTime()))
    shaderRef.current.uniforms.uCamPos.value = new Vector3(x, y, z);
    shaderRef.current.uniforms.uCamAngle.value = angle(clock.getElapsedTime());
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms} />
    </mesh>
  );
}