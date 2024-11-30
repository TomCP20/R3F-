import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { ShaderMaterial, Vector3 } from "three";
import Sdf from "./Sdf";

export default function Menger({ DPR }: Readonly<{ DPR: number; }>) {
    const shaderRef = useRef<ShaderMaterial>(null!);
    useFrame((state) => {
        const { clock } = state;
        shaderRef.current.uniforms.uCamPos.value = new Vector3(5 * Math.sin(clock.getElapsedTime()), 0, 5 * Math.cos(clock.getElapsedTime()));
        shaderRef.current.uniforms.uCamAngle.value = -clock.getElapsedTime();
    });
    return <Sdf shaderRef={shaderRef} DPR={DPR} sceneID={1} />;
}
