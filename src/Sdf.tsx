import { useFrame, useThree } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { ShaderMaterial, Uniform, Vector2, Vector3 } from "three";

import fragmentShader from './shaders/fragmentShader.glsl??raw'
import vertexShader from './shaders/vertexShader.glsl??raw'

export default function Sdf({ shaderRef, DPR, sceneID }: Readonly<{ shaderRef: MutableRefObject<ShaderMaterial>; DPR: number; sceneID: number; }>) {
  const { viewport } = useThree();
  const uniforms = {
    uTime: new Uniform(0.0),
    uResolution: new Uniform(new Vector2()),
    uCamPos: new Uniform(new Vector3()),
    uCamAngle: new Uniform(0.0),
    uSceneID: new Uniform(sceneID),
  };

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
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={shaderRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms} />
    </mesh>
  );
}